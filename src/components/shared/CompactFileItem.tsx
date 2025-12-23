/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatFileSize, getFileIcon } from "@/utils/fileHelpers";
import { X, CheckCircle } from "lucide-react";

interface FileWithUploadSuccess {
  id: string;
  file: any; // null for old files
  progress: number;
  uploaded: boolean;
  url: string;
  type: string; // image | video | file
  size?: number;
  name?: string;
  mediaUrl?: string;
}

interface FileWithProgress {
  id: string;
  file: File | null;
  progress: number;
  uploaded: boolean;
}

interface CompactFileItemProps {
  file: FileWithProgress | FileWithUploadSuccess;
  onRemove: (id: string) => void;
  uploading: boolean;
}

export function CompactFileItem({
  file,
  onRemove,
  uploading,
}: CompactFileItemProps) {
  // ============================ MIME TYPE ============================
  const mimeType =
    (file as FileWithProgress).file?.type ||
    (file as FileWithUploadSuccess).type ||
    "application/octet-stream";

  const Icon = getFileIcon(mimeType);

  // ============================ NAME ============================
  const fileName =
    (file as FileWithProgress).file?.name ||
    (file as FileWithUploadSuccess).name ||
    (file as FileWithUploadSuccess).url?.split("/").pop() ||
    (file as FileWithUploadSuccess).mediaUrl?.split("/").pop() ||
    "Unknown file";

  // ============================ SIZE ============================
  const fileSize =
    (file as FileWithProgress).file?.size ||
    (file as FileWithUploadSuccess).size ||
    0;

  // ============================ UPLOADED / PROGRESS ============================
  const uploaded = (file as any).uploaded ?? true;
  const progress = uploaded ? 100 : (file as FileWithProgress).progress ?? 0;

  return (
    <Card className="overflow-hidden border transition-colors">
      <CardContent className="px-6 py-2">
        <div className="flex items-center gap-3">
          {/* ICON */}
          <div className="w-12 h-12 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7 text-blue-600" />
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium truncate pr-2">{fileName}</p>

              {!uploading && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(file.id)}
                  className="w-6 h-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {fileSize ? formatFileSize(fileSize) : "Unknown size"}
              </span>

              {uploaded ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">Done</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500">{progress}%</span>
              )}
            </div>

            <div className="mt-2">
              <CompactProgressBar progress={progress} uploaded={uploaded} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactProgressBar({
  progress,
  uploaded,
}: {
  progress: number;
  uploaded: boolean;
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full transition-all duration-300 rounded-full ${
          uploaded ? "bg-green-500" : "bg-blue-500"
        }`}
        style={{ width: `${uploaded ? 100 : progress}%` }}
      />
    </div>
  );
}
