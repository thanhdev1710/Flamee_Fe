"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Device } from "mediasoup-client";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  socket: Socket;
  userId: string;
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
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-slate-800 rounded-lg overflow-hidden h-full w-full border border-slate-700">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      {/* [UI] Hiển thị tên user đè lên video */}
      <div className="absolute bottom-2 left-2 text-white text-xs bg-black/60 px-2 py-1 rounded font-medium">
        User: {userId.slice(0, 5)}
      </div>
    </div>
  );
};

export default function VideoCallModal({
  isOpen,
  onClose,
  roomCode,
  socket,
  userId,
}: Props) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Lưu stream của người khác
  const [remoteStreams, setRemoteStreams] = useState<
    Record<string, MediaStream>
  >({});

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<any>(null);
  const recvTransportRef = useRef<any>(null);

  // Refs để clean up khi đóng
  const producersRef = useRef<any[]>([]);
  const consumersRef = useRef<any[]>([]);

  useEffect(() => {
    if (isOpen && roomCode) {
      startCall();
    }
    return () => {
      leaveCall();
    };
  }, [isOpen, roomCode]);

  const startCall = async () => {
    try {
      deviceRef.current = new Device();

      socket.emit("get-rtp-capabilities", async (rtpCapabilities: any) => {
        if (!deviceRef.current) return;
        await deviceRef.current.load({
          routerRtpCapabilities: rtpCapabilities,
        });

        createSendTransport(); // Tạo đường gửi
        createRecvTransport(); // Tạo đường nhận (để chuẩn bị nhận video người khác)

        // Join phòng
        socket.emit("join-video-room", { roomCode, userId });
      });

      // Lấy Camera/Mic của mình
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (e) {
      console.error("Start call error:", e);
      toast.error("Không thể kết nối cuộc gọi");
      onClose();
    }
  };

  // --- SEND TRANSPORT ---
  const createSendTransport = () => {
    socket.emit("create-transport", async (params: any) => {
      if (params.error) return;

      const transport = deviceRef.current!.createSendTransport(params);
      sendTransportRef.current = transport;

      transport.on("connect", ({ dtlsParameters }, callback, errback) => {
        socket.emit(
          "connect-transport",
          { transportId: transport.id, dtlsParameters },
          () => callback()
        );
      });

      transport.on(
        "produce",
        async ({ kind, rtpParameters, appData }, callback, errback) => {
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

  // --- RECV TRANSPORT (QUAN TRỌNG ĐỂ THẤY NGƯỜI KHÁC) ---
  const createRecvTransport = () => {
    socket.emit("create-transport", async (params: any) => {
      if (params.error) return;
      const transport = deviceRef.current!.createRecvTransport(params);
      recvTransportRef.current = transport;

      transport.on("connect", ({ dtlsParameters }, callback, errback) => {
        socket.emit(
          "connect-transport",
          { transportId: transport.id, dtlsParameters },
          () => callback()
        );
      });

      // 1. Lắng nghe người MỚI vào và phát video
      socket.on("new-producer", ({ producerId, userId: peerId, kind }) => {
        consumeStream(transport, producerId, peerId, kind);
      });

      // 2. [FIX] Lắng nghe danh sách người CŨ đã có trong phòng
      socket.on("existing-producers", (producers: any[]) => {
        producers.forEach((p) => {
          // Không consume chính mình
          if (p.userId !== userId) {
            consumeStream(transport, p.producerId, p.userId, p.kind);
          }
        });
      });

      // 3. [FIX] Lắng nghe khi người khác thoát
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

        // Update State để render video
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
    // Stop Local Tracks
    if (localVideoRef.current?.srcObject) {
      const tracks = (
        localVideoRef.current.srcObject as MediaStream
      ).getTracks();
      tracks.forEach((t) => t.stop());
    }

    // Close Mediasoup things
    sendTransportRef.current?.close();
    recvTransportRef.current?.close();

    // Socket
    socket.emit("leave-video-room");

    // Cleanup Listeners
    socket.off("new-producer");
    socket.off("existing-producers");
    socket.off("peer-left");

    setRemoteStreams({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] bg-slate-950 border-slate-800 p-0 flex flex-col">
        <DialogTitle className="sr-only">Video Call</DialogTitle>

        {/* --- GRID VIDEO --- */}
        <div className="flex-1 bg-black p-2 overflow-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 auto-rows-fr">
          {/* 1. Local Video */}
          <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-sm">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <div className="absolute bottom-3 left-3 text-white text-xs font-bold bg-blue-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
              Bạn
            </div>
          </div>

          {/* 2. Remote Videos (Map) */}
          {Object.entries(remoteStreams).map(([peerId, stream]) => (
            <div
              key={peerId}
              className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800"
            >
              <RemoteVideo stream={stream} userId={peerId} />
            </div>
          ))}

          {/* 3. Waiting Placeholder */}
          {Object.keys(remoteStreams).length === 0 && (
            <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-800 text-slate-500 animate-pulse">
              <div className="text-lg font-medium">Đang đợi người khác...</div>
              <div className="text-xs mt-2 bg-slate-800 px-2 py-1 rounded text-slate-400">
                Mã phòng: {roomCode}
              </div>
            </div>
          )}
        </div>

        {/* --- CONTROLS --- */}
        <div className="h-24 bg-slate-950 flex items-center justify-center gap-6 border-t border-slate-800 shadow-2xl z-10">
          <Button
            variant={micOn ? "secondary" : "destructive"}
            size="icon"
            className="rounded-full w-14 h-14 shadow-lg transition-all hover:scale-105"
            onClick={() => setMicOn(!micOn)}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>
          <Button
            variant={camOn ? "secondary" : "destructive"}
            size="icon"
            className="rounded-full w-14 h-14 shadow-lg transition-all hover:scale-105"
            onClick={() => setCamOn(!camOn)}
          >
            {camOn ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>
          <Button
            variant="destructive"
            className="rounded-full w-32 h-14 shadow-lg bg-red-600 hover:bg-red-700 transition-all hover:scale-105"
            onClick={onClose}
          >
            <PhoneOff className="mr-2 h-6 w-6" /> Kết thúc
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
