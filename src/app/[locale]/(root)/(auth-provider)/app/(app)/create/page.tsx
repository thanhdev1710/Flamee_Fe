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
import { ImageIcon, PlayIcon, Trash2, Hash } from "lucide-react";
import { type ChangeEvent, type RefObject, useRef, useState } from "react";
import axios from "axios";
import { CompactFileItem } from "@/components/shared/CompactFileItem";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MAX_SIZE } from "@/global/base";
import { toast } from "sonner";
import TagInput from "@/components/shared/TagInput";
import { Input } from "@/components/ui/input";
import { createPost } from "@/actions/post.action";
import { Media, VisibilityEnum } from "@/types/post.type";

interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  url?: string;
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
  const [privacy, setPrivacy] = useState<VisibilityEnum>("public");
  const [hideStats, setHideStats] = useState<boolean>(false);
  const [turnOffComments, setTurnOffComments] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>("");

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const newFilesArray = Array.from(e.target.files);
    const totalFiles = files.length + newFilesArray.length;
    if (totalFiles > 5) {
      toast.error("Bạn chỉ có thể upload tối đa 5 file!", { richColors: true });
      return;
    }

    const oversizedFiles = newFilesArray.filter((file) => file.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      toast.error("File vượt quá giới hạn 4.5MB!", { richColors: true });
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

  function handleAddTag(tag: string) {
    const trimmedTag = tag.trim().toLowerCase();

    // Validate tag
    if (!trimmedTag) return;
    if (trimmedTag.length > 20) {
      toast.error("Tag không được vượt quá 20 ký tự!", { richColors: true });
      return;
    }
    if (tags.length >= 10) {
      toast.error("Bạn chỉ có thể thêm tối đa 10 tag!", { richColors: true });
      return;
    }
    if (tags.includes(trimmedTag)) {
      toast.error("Tag này đã tồn tại!", { richColors: true });
      return;
    }
    if (!/^[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF\s]+$/.test(trimmedTag)) {
      toast.error("Tag chỉ được chứa chữ cái, số và khoảng trắng!", {
        richColors: true,
      });
      return;
    }

    setTags([...tags, trimmedTag]);
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  async function handleUpload(): Promise<typeof files> {
    if (files.length === 0 || uploading) return files;

    const updatedFiles = [...files];

    const uploadPromises = files.map(async (fileWithProgress, index) => {
      const formData = new FormData();
      formData.append("file", fileWithProgress.file);

      try {
        const res = await axios.post("/api/upload-file", formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            updatedFiles[index] = {
              ...updatedFiles[index],
              progress,
            };
            setFiles([...updatedFiles]);
          },
        });

        updatedFiles[index] = {
          ...updatedFiles[index],
          uploaded: true,
          url: res.data.url,
        };
        setFiles([...updatedFiles]);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    });

    await Promise.all(uploadPromises);
    return updatedFiles;
  }

  async function handleCreatePost() {
    setUploading(true);
    let uploadedFiles = files;
    // Upload nếu chưa upload hết
    if (files.length > 0 && !files.every((f) => f.uploaded)) {
      uploadedFiles = await handleUpload(); // lấy kết quả mới
    }

    // Bây giờ dùng uploadedFiles thay vì state cũ
    const uploadedOnly: Media[] = uploadedFiles
      .filter((f) => f.uploaded)
      .map((f) => ({
        mediaUrl: f.url || "",
        mediaType: f.file.type.startsWith("image")
          ? "image"
          : f.file.type.startsWith("video")
          ? "video"
          : "file",
      }));

    const err = await createPost({
      postType: "post",
      content,
      hashtags: tags,
      title,
      visibility: privacy,
      mediaUrls: uploadedOnly,
    });

    if (err) {
      toast.error(`Đăng bài thất bại: `, err);
    } else {
      toast.success("Đăng bài thành công");
    }

    setUploading(false);
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

              {/* Title Section */}
              <div className="space-y-3">
                <label htmlFor="post-title" className="text-lg font-semibold">
                  Title
                </label>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your post a catchy title..."
                  className="text-lg font-medium"
                  maxLength={100}
                  disabled={uploading}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    A good title helps people understand what your post is about
                  </p>
                  <span className="text-xs text-gray-500">
                    {title.length}/100
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-3">
                <label className="text-lg font-semibold">Content</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="What's on your mind? Share your story..."
                  className="w-full"
                  onSearchUsers={(query) => {
                    return [
                      {
                        displayName: query,
                        id: "#000000",
                        username: "#1d4ed8",
                        avatar: "#000000",
                      },
                    ];
                  }}
                />
                <p className="text-sm">
                  Use the toolbar to format your text. Supports headings, lists,
                  links, and more.
                </p>
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <label className="text-lg font-semibold flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Tags
                </label>
                <TagInput
                  tags={tags}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  disabled={uploading}
                />
                <p className="text-sm text-gray-600">
                  Add up to 10 tags to help people discover your post. Press
                  Enter to add a tag.
                </p>
              </div>

              {/* Post Settings */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold">Post Settings</h3>

                {/* Privacy Setting */}
                <div className="space-y-2">
                  <Select
                    value={privacy}
                    onValueChange={(e: VisibilityEnum) => {
                      setPrivacy(e);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm">Who can see your post?</p>
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
                    <label htmlFor="hide-stats" className="text-sm">
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
                    <label htmlFor="turn-off-comments" className="text-sm">
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
              {uploading ? "Uploading..." : "Upload"}
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
      />
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-lg flex items-center justify-center">
              <PlayIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg">Drag photos and videos here</p>
          <p className="text-sm">Tối đa 5 file, mỗi file không quá 4.5MB</p>
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
