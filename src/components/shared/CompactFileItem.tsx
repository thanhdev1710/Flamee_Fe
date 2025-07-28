"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  X,
  CheckCircle,
  FileJson,
  FileQuestionIcon,
  FileCodeIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileVideoIcon,
  FileIcon,
} from "lucide-react";

interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
}

interface CompactFileItemProps {
  file: FileWithProgress;
  onRemove: (id: string) => void;
  uploading: boolean;
}

interface CompactProgressBarProps {
  progress: number;
  uploaded: boolean;
}

export function CompactFileItem({
  file,
  onRemove,
  uploading,
}: CompactFileItemProps) {
  const Icon = getFileIcon(file.file.type);

  return (
    <Card className="overflow-hidden border transition-colors">
      <CardContent className="px-6 py-1">
        <div className="flex items-center gap-3">
          {/* File Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium truncate pr-2">
                {file.file.name}
              </p>
              {!uploading && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(file.id)}
                  className="w-6 h-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {formatFileSize(file.file.size)}
              </span>

              {file.uploaded ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs font-medium">Done</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500">
                  {Math.round(file.progress)}%
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <CompactProgressBar
                progress={file.progress}
                uploaded={file.uploaded}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactProgressBar({ progress, uploaded }: CompactProgressBarProps) {
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

export function getFileIcon(mimeType: string) {
  if (!mimeType) return FileIcon;

  if (mimeType.startsWith("image/")) return FileImageIcon;
  if (mimeType.startsWith("video/")) return FileVideoIcon;
  if (mimeType.startsWith("audio/")) return FileAudioIcon;
  if (mimeType === "application/pdf") return FileTextIcon;

  if (
    [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar",
      "application/gzip",
    ].includes(mimeType)
  )
    return FileArchiveIcon;

  if (
    [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(mimeType)
  )
    return FileTextIcon;

  if (
    [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].includes(mimeType)
  )
    return FileSpreadsheetIcon;

  if (
    [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ].includes(mimeType)
  )
    return FileImageIcon;

  if (["application/json", "text/json"].includes(mimeType)) return FileJson;

  if (
    [
      "text/html",
      "text/css",
      "application/javascript",
      "application/typescript",
      "application/x-python-code",
      "text/x-java-source",
      "text/x-csrc",
    ].includes(mimeType)
  )
    return FileCodeIcon;

  if (mimeType.startsWith("text/")) return FileText;

  return FileQuestionIcon;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${
    sizes[i]
  }`;
}
