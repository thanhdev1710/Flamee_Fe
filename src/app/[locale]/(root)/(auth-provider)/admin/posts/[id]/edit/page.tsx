/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ImageIcon, Trash2, Hash, ArrowLeft } from "lucide-react";

import TagInput from "@/components/shared/TagInput";
import { CompactFileItem } from "@/components/shared/CompactFileItem";
import { RichTextEditor } from "@/components/shared/RichTextEditor";

import { Media, VisibilityEnum } from "@/types/post.type";
import { FileItem } from "@/utils/fileHelpers";
import { usePostDetail } from "@/services/post.hook";

import { MAX_SIZE, PAGE_SIZE } from "@/global/base";
import { updatePost } from "@/actions/post.action";
import { CLIENT_CONFIG } from "@/global/config";
import { mutate } from "swr";
import { handleToxicCheck } from "@/actions/check.handle";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { data: post, isLoading } = usePostDetail(id);

  // =================== STATE =====================
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<VisibilityEnum>("public");
  const [tags, setTags] = useState<string[]>([]);

  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const [isDragOver, setIsDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // =================== LOAD INITIAL DATA =====================
  useEffect(() => {
    if (!post) return;

    setTitle(post.title || "");
    setContent(post.content || "");
    setPrivacy(post.visibility);
    setTags(post.hashtags || []);

    // Convert existing media to "fake file items"
    const mediaFiles: any[] = [
      ...post.images.map((i: FileItem) => ({
        id: i.mediaUrl + "-old",
        file: null,
        progress: 100,
        uploaded: true,
        url: i.mediaUrl,
        type: "image",
      })),

      ...post.videos.map((i: FileItem) => ({
        id: i.mediaUrl + "-old",
        file: null,
        progress: 100,
        uploaded: true,
        url: i.mediaUrl,
        type: "video",
      })),

      ...post.files.map((i: FileItem) => ({
        id: i.mediaUrl + "-old",
        file: null,
        progress: 100,
        uploaded: true,
        url: i.mediaUrl,
        type: "file",
      })),
    ];

    setFiles(mediaFiles);
  }, [post]);

  // =================== FILE HANDLING =====================

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const newFilesArray = Array.from(e.target.files);

    if (files.length + newFilesArray.length > 5) {
      toast.error("Tối đa được upload 5 file");
      return;
    }

    const oversize = newFilesArray.some((f) => f.size > MAX_SIZE);
    if (oversize) {
      toast.error("File quá nặng (max 4.5MB)");
      return;
    }

    const mapped = newFilesArray.map((file) => ({
      id: file.name + "-" + Date.now(),
      file,
      progress: 0,
      uploaded: false,
      url: undefined,
      type: file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
        ? "video"
        : "file",
    }));

    setFiles([...files, ...mapped]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemoveFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: any) {
    e.preventDefault();
    setIsDragOver(false);
    if (!e.dataTransfer.files?.length) return;
    handleFileSelect({ target: { files: e.dataTransfer.files } } as any);
  }

  async function uploadFiles(): Promise<any[]> {
    const newFiles = [...files];

    const uploadQueue = newFiles.map(async (item, index) => {
      if (item.uploaded || !item.file) return;

      const fd = new FormData();
      fd.append("file", item.file);

      try {
        const res = await axios.post("/api/upload-local", fd, {
          onUploadProgress: (p) => {
            newFiles[index].progress = Math.round(
              (p.loaded * 100) / (p.total || 1)
            );
            setFiles([...newFiles]);
          },
        });

        newFiles[index].uploaded = true;
        newFiles[index].url = res.data.url;
      } catch (e) {
        console.log("upload error", e);
      }
    });

    await Promise.all(uploadQueue);
    return newFiles;
  }

  // =================== SUBMIT =====================

  async function handleSubmit() {
    setUploading(true);

    if (!post) {
      setUploading(false);
      return;
    }

    try {
      // 1. Upload media nếu cần
      let uploadedFiles = files;
      if (files.length > 0 && !files.every((f) => f.uploaded)) {
        uploadedFiles = await uploadFiles();
      }

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

      // 2. KIỂM DUYỆT BÀI VIẾT
      if (!(await handleToxicCheck(title + " " + content))) {
        setUploading(false);
        return;
      }

      // 3. Sửa bài viết
      const err = await updatePost(post?.id, {
        postType: "post",
        content,
        hashtags: tags,
        title,
        visibility: privacy,
        mediaUrls: uploadedOnly,
      });

      if (err) {
        toast.error("Sửa bài thất bại: " + err);
        return;
      }

      // 4. Cập nhật feed
      await mutate(
        `${CLIENT_CONFIG.API.BASE_URL}${CLIENT_CONFIG.API.VERSION}/search/hot?start=0&limit=${PAGE_SIZE}`
      );

      // 5. Hoàn tất
      router.push(`/admin/posts/${post.id}`);
      toast.success("Sửa bài thành công");
    } catch {
      toast.error("Lỗi không xác định khi sửa bài");
    } finally {
      setUploading(false);
    }
  }

  if (isLoading)
    return (
      <p className="p-6 text-muted-foreground animate-pulse">
        Đang tải bài viết...
      </p>
    );

  return (
    <ScrollArea className="h-full">
      <div className="px-4 py-8">
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
          </div>

          {/* Main Edit Card */}
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Upload section */}
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
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Media ({files.length}/5)</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFiles([])}
                      disabled={uploading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    {files.map((file) => (
                      <CompactFileItem
                        key={file.id}
                        file={file}
                        onRemove={handleRemoveFile}
                        uploading={uploading}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label className="font-semibold text-lg">Tiêu đề</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploading}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="font-semibold text-lg">Nội dung</label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="font-semibold flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Tags
                </label>
                <TagInput
                  tags={tags}
                  onAddTag={(t) => setTags([...tags, t])}
                  onRemoveTag={(t) => setTags(tags.filter((x) => x !== t))}
                />
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <label className="font-semibold">Chế độ hiển thị</label>
                <Select
                  value={privacy}
                  onValueChange={(e) => setPrivacy(e as VisibilityEnum)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Công khai</SelectItem>
                    <SelectItem value="friends">Bạn bè</SelectItem>
                    <SelectItem value="private">Riêng tư</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="lg" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button size="lg" onClick={handleSubmit} disabled={uploading}>
              {uploading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

/* ================================
   REUSE FILE UPLOAD UI
================================ */

function FileUploadArea({
  inputRef,
  disabled,
  onFileSelect,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver,
}: any) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
        isDragOver ? "border-blue-500 bg-blue-50/10" : "border-border"
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        type="file"
        ref={inputRef}
        multiple
        disabled={disabled}
        onChange={onFileSelect}
        id="file-upload"
        className="hidden"
      />

      <div className="space-y-4">
        <ImageIcon className="mx-auto w-10 h-10 opacity-60" />
        <p className="text-sm opacity-80">Kéo thả hoặc chọn file để upload</p>

        <Button asChild disabled={disabled}>
          <label htmlFor="file-upload" className="cursor-pointer">
            Chọn file
          </label>
        </Button>
      </div>
    </div>
  );
}
