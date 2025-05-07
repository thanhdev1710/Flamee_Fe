import LayoutStep from "./LayoutStep";
import { confirmCard } from "@/actions/user.action";
import { useOnboardingStore } from "@/store/onboardingStore";
import { toast } from "sonner";
import { createUserSchema } from "@/types/user.type";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function StudentCardStep() {
  const {
    nextStep,
    setLastName,
    setFirstName,
    setDob,
    setCourse,
    setMSSV,
    setMajor,
  } = useOnboardingStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraAllowed, setIsCameraAllowed] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
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

  useEffect(() => {
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      const base64 = canvas.toDataURL("image/jpeg");

      try {
        const file = await fetch(base64)
          .then((res) => res.blob())
          .then(
            (blob) => new File([blob], "capture.jpg", { type: "image/jpeg" })
          );

        const data = await confirmCard(file);

        const cardSchema = createUserSchema.pick({
          course: true,
          dob: true,
          mssv: true,
          major: true,
          lastName: true,
          firstName: true,
        });

        const [lastName, ...rest] = data.name.trim().split(" ");
        const firstName = rest.join(" ");
        const [day, month, year] = data.dob.split("/").map(Number);
        const dob = new Date(year, month - 1, day);

        const card = {
          lastName,
          firstName,
          major: data.major,
          mssv: data.mssv,
          course: data.course,
          dob,
        };

        const result = cardSchema.safeParse(card);
        if (!result.success) {
          toast.error(result.error.errors[0].message, { richColors: true });
          return;
        }

        setLastName(lastName);
        setFirstName(firstName);
        setDob(dob);
        setMSSV(data.mssv);
        setMajor(data.major);
        setCourse(data.course);

        nextStep();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Lỗi từ server";
        toast.error(message, { richColors: true });
      }
    }
  };

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
              className="rounded-xl shadow w-full max-w-md"
            />
            <canvas ref={canvasRef} hidden />
            <Button onClick={capturePhoto}>Chụp ảnh</Button>
          </>
        )}
      </div>
    </LayoutStep>
  );
}
