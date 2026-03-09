"use client";
import type React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { FileItem } from "@/utils/fileHelpers";

interface PostImageGridProps {
  images: FileItem[];
  imageLoadStates: Record<string, boolean>;
  onImageLoad: (imageId: string) => void;
  onImageClick: (e: React.MouseEvent, url?: string) => void;
  onShowAllFiles: () => void;
}

export function PostImageGrid({
  images,
  imageLoadStates,
  onImageLoad,
  onImageClick,
  onShowAllFiles,
}: PostImageGridProps) {
  if (images.length === 0) return null;

  const renderSkeleton = (
    <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
  );

  // === CASE 1: ONE IMAGE ===
  if (images.length === 1) {
    const img = images[0];
    return (
      <div
        onClick={(e) => onImageClick(e, img.mediaUrl)}
        className="relative w-full rounded-lg overflow-hidden cursor-pointer aspect-4/3 bg-muted"
      >
        {!imageLoadStates[img.id] && renderSkeleton}

        <Image
          fill
          src={img.mediaUrl}
          alt="post-image"
          className={`object-cover transition-opacity duration-300 ${
            imageLoadStates[img.id] ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => onImageLoad(img.id)}
          sizes="100vw"
        />
      </div>
    );
  }

  // === CASE 2: TWO IMAGES ===
  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
        {images.slice(0, 2).map((img, idx) => (
          <div
            key={img.id}
            onClick={(e) => onImageClick(e, img.mediaUrl)}
            className="relative aspect-4/3 cursor-pointer rounded-lg overflow-hidden bg-muted"
          >
            {!imageLoadStates[img.id] && renderSkeleton}

            <Image
              fill
              src={img.mediaUrl}
              alt={`image-${idx}`}
              className={`object-cover transition ${
                imageLoadStates[img.id] ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => onImageLoad(img.id)}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  // === CASE 3: THREE IMAGES ===
  if (images.length === 3) {
    return (
      <div className="grid grid-cols-3 gap-2 rounded-lg overflow-hidden">
        {/* big left image */}
        <div
          onClick={(e) => onImageClick(e, images[0].mediaUrl)}
          className="relative col-span-2 aspect-4/3 rounded-lg overflow-hidden bg-muted cursor-pointer"
        >
          {!imageLoadStates[images[0].id] && renderSkeleton}

          <Image
            fill
            src={images[0].mediaUrl}
            alt="main"
            className={`object-cover transition ${
              imageLoadStates[images[0].id] ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => onImageLoad(images[0].id)}
            loading="lazy"
          />
        </div>

        {/* 2 small stacked right */}
        <div className="flex flex-col gap-2">
          {images.slice(1, 3).map((img, idx) => (
            <div
              key={img.id}
              onClick={(e) => onImageClick(e, img.mediaUrl)}
              className="relative aspect-4/3 rounded-lg overflow-hidden bg-muted cursor-pointer"
            >
              {!imageLoadStates[img.id] && renderSkeleton}

              <Image
                fill
                src={img.mediaUrl}
                alt={`img-${idx}`}
                className={`object-cover transition ${
                  imageLoadStates[img.id] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => onImageLoad(img.id)}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // === CASE 4+: GRID STYLE + OVERLAY ===
  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg overflow-hidden">
      {images.slice(0, 3).map((img, idx) => (
        <div
          key={img.id}
          onClick={(e) => onImageClick(e, img.mediaUrl)}
          className="relative aspect-4/3 rounded-lg overflow-hidden cursor-pointer bg-muted"
        >
          {!imageLoadStates[img.id] && renderSkeleton}

          <Image
            fill
            src={img.mediaUrl}
            alt={`img-${idx}`}
            className={`object-cover transition ${
              imageLoadStates[img.id] ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => onImageLoad(img.id)}
            loading="lazy"
          />
        </div>
      ))}

      {/* last tile: show overlay */}
      <div
        className="relative aspect-4/3 rounded-lg overflow-hidden cursor-pointer bg-muted flex items-center justify-center"
        onClick={onShowAllFiles}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="text-center text-white z-10">
          <Plus className="w-8 h-8 mx-auto mb-1" />
          <span className="text-lg font-semibold">+{images.length - 3}</span>
        </div>
      </div>
    </div>
  );
}
