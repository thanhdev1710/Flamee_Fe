"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Device } from "mediasoup-client";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

const RemoteVideo = ({
  stream,
  userId,
}: {
  stream: MediaStream;
  userId: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative bg-slate-800 rounded-lg overflow-hidden h-full w-full border border-slate-700">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 text-white text-xs bg-black/60 px-2 py-1 rounded font-medium">
        User: {userId.slice(0, 5)}
      </div>
    </div>
  );
};

export default function VideoCallPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const roomCode = params.roomCode as string;
  const userId = searchParams.get("userId") || "";
  const socketUrl =
    process.env.NEXT_PUBLIC_CHAT_SOCKET || "http://localhost:4004";

  const [socket, setSocket] = useState<Socket | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteStreams, setRemoteStreams] = useState<
    Record<string, MediaStream>
  >({});

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<any>(null);
  const recvTransportRef = useRef<any>(null);
  const producersRef = useRef<any[]>([]);
  const consumersRef = useRef<any[]>([]);

  // 1. KHỞI TẠO SOCKET RIÊNG CHO CỬA SỔ NÀY
  useEffect(() => {
    if (!userId || !roomCode) return;

    // Tạo kết nối socket mới hoàn toàn cho cửa sổ này
    const newSocket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket"],
      query: { userId },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId, roomCode, socketUrl]);

  // 2. KHI SOCKET SẴN SÀNG -> START CALL
  useEffect(() => {
    if (socket && roomCode) {
      startCall();

      // Clean up khi đóng cửa sổ
      window.addEventListener("beforeunload", leaveCall);
      return () => {
        window.removeEventListener("beforeunload", leaveCall);
        leaveCall();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, roomCode]);

  const startCall = async () => {
    if (!socket) return;
    try {
      deviceRef.current = new Device();

      socket.emit("get-rtp-capabilities", async (rtpCapabilities: any) => {
        if (!deviceRef.current) return;
        await deviceRef.current.load({
          routerRtpCapabilities: rtpCapabilities,
        });

        createSendTransport();
        createRecvTransport();

        socket.emit("join-video-room", { roomCode, userId });
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (e) {
      console.error("Start call error:", e);
      toast.error("Lỗi kết nối cuộc gọi");
    }
  };

  const createSendTransport = () => {
    if (!socket) return;
    socket.emit("create-transport", async (params: any) => {
      if (params.error) return;
      const transport = deviceRef.current!.createSendTransport(params);
      sendTransportRef.current = transport;

      transport.on("connect", ({ dtlsParameters }, callback) => {
        socket.emit(
          "connect-transport",
          { transportId: transport.id, dtlsParameters },
          () => callback()
        );
      });

      transport.on(
        "produce",
        async ({ kind, rtpParameters, appData }, callback) => {
          socket.emit(
            "produce",
            { transportId: transport.id, kind, rtpParameters, appData },
            ({ id }: any) => callback({ id })
          );
        }
      );

      await produceMedia();
    });
  };

  const produceMedia = async () => {
    if (!localVideoRef.current?.srcObject) return;
    const stream = localVideoRef.current.srcObject as MediaStream;
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    if (videoTrack)
      producersRef.current.push(
        await sendTransportRef.current.produce({ track: videoTrack })
      );
    if (audioTrack)
      producersRef.current.push(
        await sendTransportRef.current.produce({ track: audioTrack })
      );
  };

  const createRecvTransport = () => {
    if (!socket) return;
    socket.emit("create-transport", async (params: any) => {
      if (params.error) return;
      const transport = deviceRef.current!.createRecvTransport(params);
      recvTransportRef.current = transport;

      transport.on("connect", ({ dtlsParameters }, callback) => {
        socket.emit(
          "connect-transport",
          { transportId: transport.id, dtlsParameters },
          () => callback()
        );
      });

      socket.on("new-producer", ({ producerId, userId: peerId, kind }) =>
        consumeStream(transport, producerId, peerId, kind)
      );
      socket.on("existing-producers", (producers: any[]) => {
        producers.forEach((p) => {
          if (p.userId !== userId)
            consumeStream(transport, p.producerId, p.userId, p.kind);
        });
      });
      socket.on("peer-left", ({ userId: peerId }) => {
        setRemoteStreams((prev) => {
          const newMap = { ...prev };
          delete newMap[peerId];
          return newMap;
        });
      });
    });
  };

  const consumeStream = async (
    transport: any,
    producerId: string,
    peerId: string,
    kind: string
  ) => {
    if (!socket) return;
    const { rtpCapabilities } = deviceRef.current!;
    socket.emit(
      "consume",
      { transportId: transport.id, producerId, rtpCapabilities },
      async (params: any) => {
        if (params.error) return;
        const consumer = await transport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });
        consumersRef.current.push(consumer);
        setRemoteStreams((prev) => {
          const stream = prev[peerId] || new MediaStream();
          stream.addTrack(consumer.track);
          return { ...prev, [peerId]: stream };
        });
        socket.emit("resume-consumer", { consumerId: consumer.id });
      }
    );
  };

  const leaveCall = () => {
    if (localVideoRef.current?.srcObject) {
      const tracks = (
        localVideoRef.current.srcObject as MediaStream
      ).getTracks();
      tracks.forEach((t) => t.stop());
    }
    sendTransportRef.current?.close();
    recvTransportRef.current?.close();

    if (socket) {
      socket.emit("leave-video-room");
      socket.disconnect();
    }

    // Đóng cửa sổ
    window.close();
  };

  // --- RENDER UI (Full screen, không dùng Dialog) ---
  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Grid Video */}
      <div className="flex-1 bg-black p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {/* Local */}
        <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover transform -scale-x-100"
          />
          <div className="absolute bottom-3 left-3 text-white text-xs bg-blue-600/80 px-3 py-1 rounded">
            Bạn
          </div>
        </div>
        {/* Remote */}
        {Object.entries(remoteStreams).map(([peerId, stream]) => (
          <div
            key={peerId}
            className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800"
          >
            <RemoteVideo stream={stream} userId={peerId} />
          </div>
        ))}
        {/* Waiting */}
        {Object.keys(remoteStreams).length === 0 && (
          <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-800 text-slate-500">
            <p>Đang đợi người khác...</p>
            <p className="text-xs mt-1">Mã phòng: {roomCode}</p>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="h-20 bg-slate-900 flex items-center justify-center gap-6 border-t border-slate-800">
        <Button
          variant={micOn ? "secondary" : "destructive"}
          size="icon"
          className="rounded-full w-12 h-12"
          onClick={() => setMicOn(!micOn)}
        >
          {micOn ? <Mic /> : <MicOff />}
        </Button>
        <Button
          variant={camOn ? "secondary" : "destructive"}
          size="icon"
          className="rounded-full w-12 h-12"
          onClick={() => setCamOn(!camOn)}
        >
          {camOn ? <Video /> : <VideoOff />}
        </Button>
        <Button
          variant="destructive"
          className="rounded-full bg-red-600 px-6"
          onClick={leaveCall}
        >
          <PhoneOff className="mr-2" /> Kết thúc
        </Button>
      </div>
    </div>
  );
}
