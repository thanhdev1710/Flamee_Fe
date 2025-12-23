"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Loader } from "lucide-react";
import { Device } from "mediasoup-client";
import type {
  Consumer,
  DtlsParameters,
  IceCandidate,
  IceParameters,
  Producer,
  RtpCapabilities,
  RtpParameters,
  Transport,
} from "mediasoup-client/types";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { PulseLoading } from "@/components/ui/loading-skeleton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  socket: Socket;
  userId: string;
};

type MediasoupTransportParams = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
  error?: string;
};

type ServerConsumeParams = {
  id: string;
  producerId: string;
  kind: "audio" | "video";
  rtpParameters: RtpParameters;
  error?: string;
};

type ExistingProducer = {
  producerId: string;
  userId: string;
  kind: "audio" | "video";
};

type NewProducerPayload = {
  producerId: string;
  userId: string;
  kind: "audio" | "video";
};

type PeerLeftPayload = {
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
    <div className="relative bg-linear-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden h-full w-full border border-slate-700 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 text-white text-xs bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium shadow-md">
        {userId.slice(0, 8)}...
      </div>
    </div>
  );
};

export default function VideoCallModalEnhanced({
  isOpen,
  onClose,
  roomCode,
  socket,
  userId,
}: Props) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<
    Record<string, MediaStream>
  >({});

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);

  const producersRef = useRef<Producer[]>([]);
  const consumersRef = useRef<Consumer[]>([]);

  const consumeStream = useCallback(
    async (transport: Transport, producerId: string, peerId: string) => {
      if (!deviceRef.current) return;
      const { rtpCapabilities } = deviceRef.current;

      socket.emit(
        "consume",
        { transportId: transport.id, producerId, rtpCapabilities },
        async (params: ServerConsumeParams) => {
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
    },
    [socket]
  );

  const produceMedia = useCallback(async () => {
    if (!localVideoRef.current?.srcObject || !sendTransportRef.current) return;
    const stream = localVideoRef.current.srcObject as MediaStream;

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
  }, []);

  const createSendTransport = useCallback(() => {
    if (!deviceRef.current) return;

    socket.emit(
      "create-transport",
      async (params: MediasoupTransportParams) => {
        if (params.error || !deviceRef.current) return;

        const transport = deviceRef.current.createSendTransport(params);
        sendTransportRef.current = transport;

        transport.on(
          "connect",
          (
            { dtlsParameters }: { dtlsParameters: DtlsParameters },
            callback
          ) => {
            socket.emit(
              "connect-transport",
              { transportId: transport.id, dtlsParameters },
              () => callback()
            );
          }
        );

        transport.on(
          "produce",
          async (
            {
              kind,
              rtpParameters,
              appData,
            }: {
              kind: "audio" | "video";
              rtpParameters: RtpParameters;
              appData: Record<string, unknown>;
            },
            callback
          ) => {
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
  }, [produceMedia, socket]);

  const createRecvTransport = useCallback(() => {
    if (!deviceRef.current) return;

    socket.emit(
      "create-transport",
      async (params: MediasoupTransportParams) => {
        if (params.error || !deviceRef.current) return;

        const transport = deviceRef.current.createRecvTransport(params);
        recvTransportRef.current = transport;

        transport.on(
          "connect",
          (
            { dtlsParameters }: { dtlsParameters: DtlsParameters },
            callback
          ) => {
            socket.emit(
              "connect-transport",
              { transportId: transport.id, dtlsParameters },
              () => callback()
            );
          }
        );

        socket.on(
          "new-producer",
          ({ producerId, userId: peerId }: NewProducerPayload) => {
            if (peerId === userId) return;
            void consumeStream(transport, producerId, peerId);
          }
        );

        socket.on("existing-producers", (producers: ExistingProducer[]) => {
          producers.forEach((p) => {
            if (p.userId !== userId) {
              void consumeStream(transport, p.producerId, p.userId);
            }
          });
        });

        socket.on("peer-left", ({ userId: peerId }: PeerLeftPayload) => {
          setRemoteStreams((prev) => {
            const newMap = { ...prev };
            delete newMap[peerId];
            return newMap;
          });
        });
      }
    );
  }, [consumeStream, socket, userId]);

  const leaveCall = useCallback(() => {
    if (localVideoRef.current?.srcObject) {
      const tracks = (
        localVideoRef.current.srcObject as MediaStream
      ).getTracks();
      tracks.forEach((t) => t.stop());
    }

    producersRef.current.forEach((p) => p.close());
    consumersRef.current.forEach((c) => c.close());
    producersRef.current = [];
    consumersRef.current = [];

    sendTransportRef.current?.close();
    recvTransportRef.current?.close();
    sendTransportRef.current = null;
    recvTransportRef.current = null;

    socket.emit("leave-video-room");

    socket.off("new-producer");
    socket.off("existing-producers");
    socket.off("peer-left");

    setRemoteStreams({});
  }, [socket]);

  const startCall = useCallback(async () => {
    try {
      setIsLoading(true);
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
          setIsLoading(false);
        }
      );

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (e) {
      console.error("Start call error:", e);
      setIsLoading(false);
      toast.error("Không thể kết nối cuộc gọi");
      onClose();
    }
  }, [
    createRecvTransport,
    createSendTransport,
    onClose,
    roomCode,
    socket,
    userId,
  ]);

  useEffect(() => {
    if (isOpen && roomCode) {
      void startCall();
    }
    return () => {
      leaveCall();
    };
  }, [isOpen, roomCode, startCall, leaveCall]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] bg-linear-to-b from-slate-950 to-slate-900 border-slate-800 p-0 flex flex-col shadow-2xl">
        <DialogTitle className="sr-only">Video Call</DialogTitle>

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-slate-100 text-sm font-medium">
                Khởi tạo cuộc gọi...
              </span>
            </div>
          </div>
        )}

        {/* --- GRID VIDEO --- */}
        <div className="flex-1 bg-black p-3 overflow-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 auto-rows-fr">
          {/* Local Video */}
          <div className="relative bg-linear-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform -scale-x-100"
            />
            <div className="absolute bottom-3 left-3 text-white text-xs font-bold bg-blue-600 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-blue-500/50">
              📹 Bạn
            </div>
          </div>

          {/* Remote Videos */}
          {Object.entries(remoteStreams).map(([peerId, stream]) => (
            <div
              key={peerId}
              className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-lg"
            >
              <RemoteVideo stream={stream} userId={peerId} />
            </div>
          ))}

          {/* Waiting Placeholder */}
          {Object.keys(remoteStreams).length === 0 && (
            <div className="flex flex-col items-center justify-center bg-linear-to-br from-slate-900/50 to-slate-800/50 rounded-xl border-2 border-dashed border-slate-700 text-slate-400">
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-300 mb-1">
                    Đang đợi người tham gia...
                  </div>
                  <div className="text-xs bg-slate-800/80 px-3 py-1.5 rounded-full text-slate-400 inline-block backdrop-blur-sm">
                    Mã phòng:{" "}
                    <span className="font-mono text-blue-400">{roomCode}</span>
                  </div>
                </div>
                <PulseLoading size="sm" />
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="h-24 bg-slate-950 flex items-center justify-center gap-4 border-t border-slate-800 shadow-2xl">
          <Button
            variant={micOn ? "secondary" : "destructive"}
            size="icon"
            className="rounded-full w-14 h-14 shadow-lg transition-all hover:scale-110 active:scale-95"
            onClick={() => setMicOn((prev) => !prev)}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>
          <Button
            variant={camOn ? "secondary" : "destructive"}
            size="icon"
            className="rounded-full w-14 h-14 shadow-lg transition-all hover:scale-110 active:scale-95"
            onClick={() => setCamOn((prev) => !prev)}
          >
            {camOn ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>
          <Button
            variant="destructive"
            className="rounded-full w-32 h-14 shadow-lg bg-red-600 hover:bg-red-700 transition-all hover:scale-105 active:scale-95 font-semibold"
            onClick={onClose}
          >
            <PhoneOff className="mr-2 h-6 w-6" /> Kết thúc
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
