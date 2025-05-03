/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import LayoutStep from "./LayoutStep";
import { useOnboardingStore } from "@/store/onboardingStore";
import { Loader2, Camera } from "lucide-react";
import { getCroppedImg } from "@/utils/cropImage";
import { confirmCard } from "@/actions/user.action";

export default function StudentCardStep() {
  const { nextStep } = useOnboardingStore();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const onSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCroppedImageUrl(null);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImageUrl(croppedImage);
    } catch {
      console.error("Xác nhận ảnh thất bại");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!croppedImageUrl) return;
    setIsProcessing(true);
    try {
      await confirmCard(croppedImageUrl);
      nextStep();
    } catch {
      console.error("Xác thực ảnh thất bại");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeImage = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppedImageUrl(null);
  };

  return (
    <LayoutStep isPrev={false} isNext={false}>
      <div className="max-w-md mx-auto text-center space-y-6 p-6 shadow rounded-xl">
        {/* Tiêu đề & mô tả */}
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

        {/* Khung tải ảnh */}
        {!imageSrc && (
          <div
            className="w-full h-[300px] border-4 border-dashed rounded-xl transition flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center text-gray-400">
              <Camera size={40} />
              <p className="mt-2 font-medium">Nhấn để tải ảnh từ thiết bị</p>
              <p className="text-xs text-gray-400">(Hỗ trợ JPG, PNG)</p>
            </div>
          </div>
        )}

        {/* Input file */}
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          ref={fileInputRef}
          onChange={onSelectFile}
          className="hidden"
        />

        {/* Crop ảnh */}
        {imageSrc && !croppedImageUrl && (
          <>
            <div className="relative w-full h-[300px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={8 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
            />
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleChangeImage} variant="outline">
                Chọn ảnh khác
              </Button>
              <Button onClick={handleCrop}>
                {isProcessing && <Loader2 className="animate-spin mr-2" />}
                Xem trước ảnh
              </Button>
            </div>
          </>
        )}

        {/* Preview và xác nhận */}
        {croppedImageUrl && (
          <>
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <img
                src={croppedImageUrl}
                alt="Ảnh xem trước"
                className="w-full object-contain max-h-[300px] bg-white"
              />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={handleChangeImage} variant="outline">
                Chọn lại ảnh
              </Button>
              <Button onClick={handleConfirm} disabled={isProcessing}>
                {isProcessing && <Loader2 className="animate-spin mr-2" />}
                Xác nhận ảnh thẻ
              </Button>
            </div>
          </>
        )}
      </div>
    </LayoutStep>
  );
}
