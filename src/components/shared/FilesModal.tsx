"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Eye, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileItem, getFileIcon, formatFileSize } from "@/utils/fileHelpers";

interface FilesModalProps {
  images: FileItem[];
  videos: FileItem[];
  files: FileItem[];
  onClose: () => void;
  postTitle: string;
}

type TabKey = "images" | "videos" | "files";

export function FilesModal({
  images,
  videos,
  files,
  onClose,
  postTitle,
}: FilesModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(
    images.length > 0 ? "images" : videos.length > 0 ? "videos" : "files"
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Esc key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedImage) setSelectedImage(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, selectedImage]);

  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;
  const hasFiles = files.length > 0;

  return (
    <>
      {/* Main Modal */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-background border rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="font-semibold text-lg">Media & Files</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                From: {postTitle || "Post"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("images")}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === "images"
                  ? "border-b-2 border-primary bg-muted/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Images ({images.length})
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === "videos"
                  ? "border-b-2 border-primary bg-muted/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`flex-1 px-6 py-3 text-sm font-medium ${
                activeTab === "files"
                  ? "border-b-2 border-primary bg-muted/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Files ({files.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Images Tab */}
            {activeTab === "images" && (
              <div className="space-y-6">
                {hasImages ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={img.id ?? img.url ?? index}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-muted"
                        onClick={() => setSelectedImage(img.url)}
                      >
                        <Image
                          fill
                          src={img.url || "/placeholder.svg"}
                          alt={img.name || "Image"}
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-background/90 text-foreground text-xs px-2 py-1 rounded truncate">
                            {img.name}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="bg-background/90 text-foreground text-xs px-2 py-1 rounded">
                            {index + 1}/{images.length}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="🖼️" label="No images to display" />
                )}
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="space-y-4">
                {hasVideos ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((vid, index) => (
                      <div
                        key={vid.id ?? vid.url ?? index}
                        className="relative rounded-lg overflow-hidden bg-muted flex items-center gap-3 p-3"
                      >
                        <div className="relative w-20 h-14 rounded-md overflow-hidden bg-black/60 flex items-center justify-center">
                          {vid.url ? (
                            <Image
                              src={vid.url}
                              alt={vid.name || "Video"}
                              fill
                              className="object-cover opacity-80"
                            />
                          ) : null}
                          <Play className="w-6 h-6 text-white relative z-10" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {vid.name || "Video"}
                          </p>
                          {vid.size && (
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(vid.size)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="gap-1"
                          >
                            <a href={vid.url} target="_blank" rel="noreferrer">
                              <Eye className="w-4 h-4" />
                              View
                            </a>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="p-2"
                          >
                            <a href={vid.url} download>
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="🎬" label="No videos to display" />
                )}
              </div>
            )}

            {/* Files Tab */}
            {activeTab === "files" && (
              <div className="space-y-3">
                {hasFiles ? (
                  files.map((file) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div
                        key={file.id ?? file.url}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                          <Icon />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {file.name || "File"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="bg-muted px-2 py-1 rounded text-xs">
                              {file.type?.split("/")[1]?.toUpperCase() ||
                                "FILE"}
                            </span>
                            {file.size && (
                              <span>{formatFileSize(file.size)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <a href={file.url} target="_blank" rel="noreferrer">
                              <Eye className="w-4 h-4" />
                              View
                            </a>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="p-2"
                          >
                            <a href={file.url} download>
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState icon="📎" label="No files to display" />
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Total: {images.length} images, {videos.length} videos,{" "}
                {files.length} files
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Download All
                </Button>
                <Button size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Full size image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={() => setSelectedImage(null)}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-background/80 rounded-full w-10 h-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </div>
  );
}
