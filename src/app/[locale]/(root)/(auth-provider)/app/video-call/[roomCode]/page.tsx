"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";

import { Device } from "mediasoup-client";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

import type {
  RtpParameters,
  Transport,
  Producer,
  RtpCapabilities,
  Consumer,
  IceParameters,
  IceCandidate,
  DtlsParameters,
} from "mediasoup-client/types";

type MediasoupTransportParams = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
  error?: string;
};

type ProducerInfo = {
  producerId: string;
  userId: string;
  kind: "audio" | "video";
};

type ConsumeParams = {
  id: string;
  producerId: string;
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
  error?: string;
};

const RemoteVideo = ({
  stream,
  userId,
}: {
  stream: MediaStream;
  userId: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
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

  const socketUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteStreams, setRemoteStreams] = useState<
    Record<string, MediaStream>
  >({});

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const deviceRef = useRef<Device | null>(null);

  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);

  const producersRef = useRef<Producer[]>([]);
  const consumersRef = useRef<Consumer[]>([]);

  // =====================================================
  // 1. Tạo socket cho tab này
  // =====================================================
  useEffect(() => {
    if (!userId || !roomCode) return;

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      path: "/socket.io/",
      query: { userId },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId, roomCode, socketUrl]);

  // =====================================================
  // 2. Khi socket sẵn sàng → Bắt đầu cuộc gọi
  // =====================================================
  useEffect(() => {
    if (!socket) return;

    startCall();

    window.addEventListener("beforeunload", leaveCall);
    return () => {
      window.removeEventListener("beforeunload", leaveCall);
      leaveCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // =====================================================
  // START CALL
  // =====================================================
  const startCall = async () => {
    if (!socket) return;
    try {
      deviceRef.current = new Device();

      socket.emit(
        "get-rtp-capabilities",
        async (rtpCapabilities: RtpCapabilities) => {
          if (!deviceRef.current) return;

          await deviceRef.current.load({
            routerRtpCapabilities: rtpCapabilities,
          });

          createSendTransport();
          createRecvTransport();

          socket.emit("join-video-room", { roomCode, userId });
        }
      );

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.error("Start call error:", e);
      toast.error("Lỗi kết nối cuộc gọi");
    }
  };

  // =====================================================
  // SEND TRANSPORT
  // =====================================================
  const createSendTransport = () => {
    if (!socket || !deviceRef.current) return;

    socket.emit(
      "create-transport",
      async (params: MediasoupTransportParams) => {
        if (params.error || !deviceRef.current) return;

        const transport = deviceRef.current.createSendTransport(params);
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
              ({ id }: { id: string }) => callback({ id })
            );
          }
        );

        await produceMedia();
      }
    );
  };

  const produceMedia = async () => {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    if (!stream || !sendTransportRef.current) return;

    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    if (videoTrack) {
      const producer = await sendTransportRef.current.produce({
        track: videoTrack,
      });
      producersRef.current.push(producer);
    }

    if (audioTrack) {
      const producer = await sendTransportRef.current.produce({
        track: audioTrack,
      });
      producersRef.current.push(producer);
    }
  };

  // =====================================================
  // RECV TRANSPORT
  // =====================================================
  const createRecvTransport = () => {
    if (!socket || !deviceRef.current) return;

    socket.emit(
      "create-transport",
      async (params: MediasoupTransportParams) => {
        if (params.error || !deviceRef.current) return;

        const transport = deviceRef.current.createRecvTransport(params);
        recvTransportRef.current = transport;

        transport.on("connect", ({ dtlsParameters }, callback) => {
          socket.emit(
            "connect-transport",
            { transportId: transport.id, dtlsParameters },
            () => callback()
          );
        });

        socket.on("existing-producers", (producers: ProducerInfo[]) => {
          producers.forEach((p) => {
            if (p.userId !== userId)
              consumeStream(transport, p.producerId, p.userId);
          });
        });

        socket.on(
          "new-producer",
          ({ producerId, userId: peerId }: ProducerInfo) =>
            consumeStream(transport, producerId, peerId)
        );

        socket.on("peer-left", ({ userId: peerId }: { userId: string }) => {
          setRemoteStreams((prev) => {
            const newMap = { ...prev };
            delete newMap[peerId];
            return newMap;
          });
        });
      }
    );
  };

  // =====================================================
  // CONSUME STREAM
  // =====================================================
  const consumeStream = async (
    transport: Transport,
    producerId: string,
    peerId: string
  ) => {
    if (!socket || !deviceRef.current) return;

    const rtpCapabilities = deviceRef.current.rtpCapabilities;

    socket.emit(
      "consume",
      {
        transportId: transport.id,
        producerId,
        rtpCapabilities,
      },
      async (params: ConsumeParams) => {
        if (params.error) return;

        const consumer = await transport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        consumersRef.current.push(consumer);

        setRemoteStreams((prev) => {
          const existing = prev[peerId] || new MediaStream();
          existing.addTrack(consumer.track);
          return { ...prev, [peerId]: existing };
        });

        socket.emit("resume-consumer", { consumerId: consumer.id });
      }
    );
  };

  // =====================================================
  // LEAVE CALL
  // =====================================================
  const leaveCall = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    if (stream) stream.getTracks().forEach((t) => t.stop());

    sendTransportRef.current?.close();
    recvTransportRef.current?.close();

    if (socket) {
      socket.emit("leave-video-room");
      socket.disconnect();
    }

    window.close();
  };

  // =====================================================
  // RENDER UI
  // =====================================================
  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Video Grid */}
      <div className="flex-1 bg-black p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {/* Local Video */}
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

        {/* Remote Videos */}
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

      {/* Control Bar */}
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
