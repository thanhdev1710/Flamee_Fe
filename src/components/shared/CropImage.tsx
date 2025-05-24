"use client";

import { Camera, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "../ui/button";
import { getCroppedImg } from "@/utils/cropImage";
import { Slider } from "../ui/slider";
import { base64ToFile } from "@/utils/image";
import { toast } from "sonner";
import Image from "next/image";

export default function CropImage({
  action,
  aspect,
  isCircular = false,
  imgDefault = null,
}: {
  action: (file: File) => Promise<void>;
  aspect: number;
  isCircular?: boolean;
  imgDefault?: string | null;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(
    imgDefault
  );
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false); // 👈 Reset trạng thái

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCroppedImageUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_: unknown, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImageUrl(croppedImage);
    } catch {
      console.error("Cắt ảnh thất bại");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!croppedImageUrl) {
      toast.error("Vui lòng cắt ảnh trước khi xác nhận", { richColors: true });
      return;
    }
    if (imgDefault === croppedImageUrl) {
      toast.error("Ảnh chưa được thay đổi. Vui lòng chọn ảnh mới", {
        richColors: true,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const image = await base64ToFile(croppedImageUrl);
      await action(image);
    } catch {
      console.error("Xác nhận ảnh thất bại");
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
    <div>
      {/* Khung tải ảnh */}
      {!imageSrc && !croppedImageUrl && (
        <div
          className={`w-full h-[300px] border-4 border-dashed rounded-xl transition flex items-center justify-center cursor-pointer ${
            isDragging ? "border-flamee-primary" : "border-gray-500"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={`flex flex-col items-center ${
              isDragging ? "text-flamee-primary" : "text-gray-500"
            } pointer-events-none`}
          >
            <Camera size={40} />
            <p className="mt-2 mb-4 text-center">
              Nhấn để <strong>tải ảnh từ thiết bị</strong> <br /> hoặc{" "}
              <strong>kéo thả ảnh</strong> vào đây
            </p>
            <p className="text-xs">Tất cả ảnh</p>
          </div>
        </div>
      )}

      {/* Input file */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onSelectFile}
        className="hidden"
      />

      {/* Crop view */}
      {imageSrc && !croppedImageUrl && (
        <>
          <div className="relative w-full h-[300px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Slider */}
          <div className="mt-6 w-full max-w-[300px] mx-auto">
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
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
          <div
            className={`border overflow-hidden shadow-sm mx-auto ${
              isCircular
                ? "rounded-full w-[300px] h-auto aspect-square"
                : "rounded-xl w-full max-w-[500px] h-auto aspect-[8/5]"
            }`}
          >
            <Image
              width={300}
              height={200}
              src={croppedImageUrl}
              alt="Ảnh xem trước"
              className="w-full h-full"
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={handleChangeImage}
              disabled={isProcessing}
              variant="outline"
            >
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
  );
}
