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
  aspectRatio?: string; // e.g., "3/2" for PostCard, "4/3" for PostCardDetail
}

export function PostImageGrid({
  images,
  imageLoadStates,
  onImageLoad,
  onImageClick,
  onShowAllFiles,
  aspectRatio = "3/2", // Default for PostCard
}: PostImageGridProps) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div
        onClick={(e) => onImageClick(e, images[0].url)}
        className={`relative mb-4 aspect-[${aspectRatio}] w-full rounded-lg overflow-hidden cursor-pointer`}
      >
        {!imageLoadStates[images[0].id] && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          fill
          src={images[0].url || "/placeholder.svg"}
          sizes="100vw"
          alt={images[0].name}
          className={`object-cover ${
            imageLoadStates[images[0].id] ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => onImageLoad(images[0].id)}
          priority
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden">
        {images.slice(0, 2).map((img) => (
          <div
            key={img.id}
            onClick={(e) => onImageClick(e, img.url)}
            className="relative aspect-square cursor-pointer"
          >
            {!imageLoadStates[img.id] && (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <Image
              fill
              src={img.url || "/placeholder.svg"}
              alt={img.name}
              className={`object-cover ${
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

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden">
        <div
          onClick={(e) => onImageClick(e, images[0].url)}
          className="relative aspect-square cursor-pointer"
        >
          {!imageLoadStates[images[0].id] && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            fill
            src={images[0].url || "/placeholder.svg"}
            alt={images[0].name}
            className={`object-cover ${
              imageLoadStates[images[0].id] ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => onImageLoad(images[0].id)}
            loading="lazy"
          />
        </div>
        <div className="grid grid-rows-2 gap-1">
          {images.slice(1, 3).map((img) => (
            <div
              key={img.id}
              onClick={(e) => onImageClick(e, img.url)}
              className="relative aspect-square cursor-pointer"
            >
              {!imageLoadStates[img.id] && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                fill
                src={img.url || "/placeholder.svg"}
                alt={img.name}
                className={`object-cover ${
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

  // 4+ images
  return (
    <div className="grid grid-cols-2 gap-1 mb-4 rounded-lg overflow-hidden">
      {images.slice(0, 3).map((img) => (
        <div
          key={img.id}
          onClick={(e) => onImageClick(e, img.url)}
          className="relative aspect-square cursor-pointer"
        >
          {!imageLoadStates[img.id] && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            fill
            src={img.url || "/placeholder.svg"}
            alt={img.name}
            className={`object-cover ${
              imageLoadStates[img.id] ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => onImageLoad(img.id)}
            loading="lazy"
          />
        </div>
      ))}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onShowAllFiles();
        }}
        className="relative aspect-square cursor-pointer bg-muted flex items-center justify-center hover:bg-muted/80"
      >
        <div className="text-center">
          <Plus className="w-6 h-6 mx-auto mb-1" />
          <span className="text-sm font-medium">+{images.length - 3}</span>
        </div>
      </div>
    </div>
  );
}
