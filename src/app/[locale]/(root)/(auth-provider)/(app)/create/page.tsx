"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, PlayIcon, Trash2 } from "lucide-react";
import { type ChangeEvent, type RefObject, useRef, useState } from "react";
import axios from "axios";
import { CompactFileItem } from "@/components/shared/CompactFileItem";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
}

interface FileInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  disabled: boolean;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragOver: boolean;
}

interface FileListProps {
  files: FileWithProgress[];
  onRemove: (id: string) => void;
  uploading: boolean;
}

export default function CreatePostPage() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [privacy, setPrivacy] = useState<string>("public");
  const [hideStats, setHideStats] = useState<boolean>(false);
  const [turnOffComments, setTurnOffComments] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const newFilesArray = Array.from(e.target.files);
    const totalFiles = files.length + newFilesArray.length;

    if (totalFiles > 5) {
      alert("Bạn chỉ có thể upload tối đa 5 file!");
      return;
    }

    const newFiles = newFilesArray.map((file) => ({
      file,
      progress: 0,
      uploaded: false,
      id: `${file.name}-${Date.now()}`,
    }));
    setFiles([...files, ...newFiles]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const totalFiles = files.length + droppedFiles.length;

    if (totalFiles > 5) {
      alert("Bạn chỉ có thể upload tối đa 5 file!");
      return;
    }

    const newFiles = droppedFiles.map((file) => ({
      file,
      progress: 0,
      uploaded: false,
      id: `${file.name}-${Date.now()}`,
    }));
    setFiles([...files, ...newFiles]);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function removeFile(id: string) {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }

  function handleClear() {
    setFiles([]);
  }

  async function handleUpload() {
    if (files.length === 0 || uploading) return;
    setUploading(true);

    const uploadPromises = files.map(async (fileWithProgress) => {
      const formData = new FormData();
      formData.append("file", fileWithProgress.file);

      try {
        await axios.post("https://httpbin.org/post", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setFiles((prevFiles) =>
              prevFiles.map((file) =>
                file.id === fileWithProgress.id ? { ...file, progress } : file
              )
            );
          },
        });
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileWithProgress.id ? { ...file, uploaded: true } : file
          )
        );
      } catch (error) {
        console.error(error);
      }
    });

    await Promise.all(uploadPromises);
    await new Promise((res) =>
      setTimeout(() => {
        res("");
      }, 1000)
    );
    setUploading(false);
  }

  async function handleCreatePost() {
    // Upload files first if there are any
    if (files.length > 0 && !files.every((f) => f.uploaded)) {
      await handleUpload();
    }

    // Handle post creation logic here
    console.log({
      content,
      files: files.filter((f) => f.uploaded),
      privacy,
      hideStats,
      turnOffComments,
    });
  }

  return (
    <ScrollArea className="h-full py-8">
      <div className="px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="mt-2 text-gray-600">
              Share your thoughts with the world
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <FileUploadArea
                  inputRef={inputRef}
                  disabled={uploading}
                  onFileSelect={handleFileSelect}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  isDragOver={isDragOver}
                />

                {files.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          Selected Files ({files.length}/5)
                        </h3>
                        <span className="text-xs px-2 py-1 rounded">
                          Tối đa 5 file
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleClear}
                        disabled={uploading}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                      </Button>
                    </div>
                    <FileList
                      files={files}
                      onRemove={removeFile}
                      uploading={uploading}
                    />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="space-y-3">
                <label className="text-lg font-semibold">Content</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="What's on your mind? Share your story..."
                  className="w-full"
                />
                <p className="text-sm">
                  Use the toolbar to format your text. Supports headings, lists,
                  links, and more.
                </p>
              </div>

              {/* Post Settings */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold">Post Settings</h3>

                {/* Privacy Setting */}
                <div className="space-y-2">
                  <Select value={privacy} onValueChange={setPrivacy}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm ">Who can see your post?</p>
                </div>

                {/* Additional Settings */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hide-stats"
                      checked={hideStats}
                      onCheckedChange={(check) => {
                        if (typeof check === "boolean") {
                          setHideStats(check);
                        }
                      }}
                    />

                    <label htmlFor="hide-stats" className="text-sm ">
                      Hide like and view counts on this post
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="turn-off-comments"
                      checked={turnOffComments}
                      onCheckedChange={(check) => {
                        if (typeof check === "boolean") {
                          setTurnOffComments(check);
                        }
                      }}
                    />
                    <label htmlFor="turn-off-comments" className="text-sm ">
                      Turn off commenting
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="lg">
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleCreatePost}
              disabled={(!content.trim() && files.length === 0) || uploading}
            >
              {uploading ? "Uploading..." : "Preview"}
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[90px]"></div>
    </ScrollArea>
  );
}

function FileUploadArea({
  inputRef,
  disabled,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver,
}: FileInputProps) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver ? "border-flamee-primary" : ""
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={onFileSelect}
        multiple
        className="hidden"
        id="file-upload"
        disabled={disabled}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />

      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-lg flex items-center justify-center">
              <PlayIcon className="w-4 h-4 " />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg">Drag photos and videos here</p>
          <p className="text-sm">Tối đa 5 file, mỗi file không quá 10MB</p>
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              Select from computer
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
}

function FileList({ files, onRemove, uploading }: FileListProps) {
  return (
    <div className="grid gap-2">
      {files.map((file) => (
        <CompactFileItem
          key={file.id}
          file={file}
          onRemove={onRemove}
          uploading={uploading}
        />
      ))}
    </div>
  );
}
