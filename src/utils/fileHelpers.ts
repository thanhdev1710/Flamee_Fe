import {
  FileIcon,
  FileImageIcon,
  FileVideoIcon,
  FileAudioIcon,
  FileTextIcon,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileJson,
  FileCodeIcon,
  FileText,
  FileQuestionIcon,
} from "lucide-react";

export interface FileItem {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
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
