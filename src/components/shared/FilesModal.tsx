"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileItem, getFileIcon, formatFileSize } from "@/utils/fileHelpers";

interface FilesModalProps {
  images: FileItem[];
  files: FileItem[];
  onClose: () => void;
  postTitle: string;
}

export function FilesModal({
  images,
  files,
  onClose,
  postTitle,
}: FilesModalProps) {
  const [activeTab, setActiveTab] = useState<"images" | "files">("images");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedImage) {
          setSelectedImage(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, selectedImage]);

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
                From: {postTitle}
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
              className={`flex-1 px-6 py-4 text-sm font-medium ${
                activeTab === "images"
                  ? "border-b-2 border-primary bg-muted/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Images ({images.length})
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`flex-1 px-6 py-4 text-sm font-medium ${
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
            {activeTab === "images" && (
              <div className="space-y-6">
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-muted"
                        onClick={() => setSelectedImage(img.url)}
                      >
                        <Image
                          fill
                          src={img.url || "/placeholder.svg"}
                          alt={img.name}
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
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🖼️</span>
                    </div>
                    <p className="text-muted-foreground font-medium">
                      No images to display
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "files" && (
              <div className="space-y-3">
                {files.length > 0 ? (
                  files.map((file) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                          <Icon />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="bg-muted px-2 py-1 rounded text-xs">
                              {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                            </span>
                            {file.size && (
                              <span>{formatFileSize(file.size)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📎</span>
                    </div>
                    <p className="text-muted-foreground font-medium">
                      No files to display
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Total: {images.length} images, {files.length} files
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Download All
                </Button>
                <Button onClick={onClose}>Close</Button>
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
