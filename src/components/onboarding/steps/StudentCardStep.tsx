import LayoutStep from "./LayoutStep";
import { confirmCard } from "@/actions/user.action";
import { useOnboardingStore } from "@/store/onboardingStore";
import { toast } from "sonner";
import { createUserSchema } from "@/types/user.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { base64ToFile } from "@/utils/image";

export default function StudentCardStep() {
  const { nextStep, setMSSV } = useOnboardingStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraAllowed, setIsCameraAllowed] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      setIsCameraAllowed(true);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch {
      toast.error("Không thể bật camera. Vui lòng kiểm tra quyền truy cập.", {
        richColors: true,
      });
    }
  };

  const offCamera = async () => {
    setStream(null);
    setIsCameraAllowed(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const capturePhoto = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      const base64 = canvas.toDataURL("image/jpeg");

      try {
        const file = await base64ToFile(base64);

        const mssv = await confirmCard(file);

        const cardSchema = createUserSchema.pick({
          mssv: true,
        });

        const result = cardSchema.safeParse({ mssv });
        if (!result.success) {
          toast.error(result.error.errors[0].message, { richColors: true });
          return;
        }

        setMSSV(mssv);

        nextStep();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Lỗi từ server";
        toast.error(message, { richColors: true });
      }
    }
  }, [setMSSV, nextStep]);

  useEffect(() => {
    let isMounted = true;

    const startLoop = async () => {
      while (isMounted) {
        await capturePhoto(); // Chờ xử lý xong
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    };

    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        startLoop(); // Bắt đầu vòng lặp tuần tự
      };
    }

    return () => {
      isMounted = false;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream, capturePhoto]);

  return (
    <LayoutStep isPrev={false} isNext={false}>
      <div className="max-w-md mx-auto mb-4 text-center space-y-6 p-6 shadow rounded-xl">
        <h2 className="text-2xl font-bold text-flamee-primary">
          Ảnh thẻ sinh viên
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed text-left space-y-2">
          <span className="block">
            📸 Ảnh cần theo tỷ lệ <strong>4:3</strong>, thấy rõ khuôn mặt.
          </span>
          <span className="block">
            🚫 Không sử dụng ảnh mờ, bị che khuất hoặc chụp ngược sáng.
          </span>
          <span className="block">
            🔒 Ảnh <strong>chỉ dùng một lần</strong> để xác thực,{" "}
            <strong>không lưu trữ</strong>.
          </span>
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {!isCameraAllowed ? (
          <Button onClick={startCamera}>Bật camera</Button>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="rounded-xl shadow w-full max-w-md border border-gray-300 bg-black"
            />
            <canvas ref={canvasRef} hidden />
            <Button onClick={offCamera}>Tắt camera</Button>
          </>
        )}
      </div>
    </LayoutStep>
  );
}
