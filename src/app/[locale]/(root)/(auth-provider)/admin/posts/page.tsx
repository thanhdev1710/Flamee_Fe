/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import { searchPost } from "@/services/post.service";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Search,
  Images,
  Video,
  File as FileIcon,
  Lock,
  Users,
  Globe,
} from "lucide-react";

import { ActionMenu } from "@/components/admin/action-menu";
import { toast } from "sonner";
import { deletePost } from "@/actions/post.action";

export default function AdminPostsPage() {
  // ====================== SEARCH ======================
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // ====================== FILTERS ======================
  const [hasMedia, setHasMedia] = useState<"all" | "yes" | "no">("all");
  const [mediaType, setMediaType] = useState<
    "all" | "image" | "video" | "file"
  >("all");

  // ====================== PAGINATION ======================
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, mutate } = useSWR(
    ["admin-posts", debouncedSearch, hasMedia, mediaType, page],
    async () => {
      const start = (page - 1) * limit;

      const res = await searchPost({
        q: debouncedSearch || undefined,
        limit,
        start,
        hasMedia: hasMedia === "all" ? undefined : hasMedia === "yes",
        mediaType: mediaType === "all" ? undefined : mediaType,
      });

      return res; //
    },
    { revalidateOnFocus: false }
  );

  // ====================== PARSE DATA ======================
  const posts = data?.items || [];
  const total = data?.total || 0;
  const size = data?.size || limit;

  const totalPages = Math.ceil(total / size);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Bài viết</h1>
      </div>

      {/* SEARCH + FILTERS */}
      <Card className="p-4 space-y-4 border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo nội dung / tiêu đề / hashtags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-4">
          {/* FILTER hasMedia */}
          <Select value={hasMedia} onValueChange={(v: any) => setHasMedia(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Media" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả bài viết</SelectItem>
              <SelectItem value="yes">Có media</SelectItem>
              <SelectItem value="no">Không có media</SelectItem>
            </SelectContent>
          </Select>

          {/* FILTER mediaType */}
          <Select value={mediaType} onValueChange={(v: any) => setMediaType(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Loại media" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Mọi loại media</SelectItem>
              <SelectItem value="image">Hình ảnh</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="file">Tập tin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tác giả</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Like</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Share</TableHead>
              <TableHead>Hiển thị</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  {/* AUTHOR */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={post.author_avatar} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {post.author_username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{post.author_id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* TITLE */}
                  <TableCell className="max-w-xs truncate font-medium">
                    {post.title || "Không có tiêu đề"}
                  </TableCell>

                  {/* MEDIA */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {post.images.length > 0 && (
                        <Images className="w-4 h-4 text-blue-400" />
                      )}
                      {post.videos.length > 0 && (
                        <Video className="w-4 h-4 text-purple-400" />
                      )}
                      {post.files.length > 0 && (
                        <FileIcon className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                  </TableCell>

                  {/* STATS */}
                  <TableCell>{post.like_count}</TableCell>
                  <TableCell>{post.comment_count}</TableCell>
                  <TableCell>{post.share_count}</TableCell>

                  {/* VISIBILITY */}
                  <TableCell>
                    {post.visibility === "public" && (
                      <Badge
                        variant="outline"
                        className="gap-1 text-green-600 border-green-500/40"
                      >
                        <Globe className="w-4 h-4" /> Public
                      </Badge>
                    )}

                    {post.visibility === "friends" && (
                      <Badge
                        variant="outline"
                        className="gap-1 text-blue-600 border-blue-500/40"
                      >
                        <Users className="w-4 h-4" /> Friends
                      </Badge>
                    )}

                    {post.visibility === "private" && (
                      <Badge
                        variant="outline"
                        className="gap-1 text-gray-600 border-gray-500/40"
                      >
                        <Lock className="w-4 h-4" /> Private
                      </Badge>
                    )}
                  </TableCell>

                  {/* DATE */}
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell>
                    <ActionMenu
                      resourceId={post.id}
                      resourceType="post"
                      actions={[
                        { label: "Xem bài viết", action: "view" },
                        { label: "Chỉnh sửa", action: "edit" },
                        {
                          label: "Xóa",
                          action: "custom",
                          variant: "destructive",
                          onCustomAction: () => {
                            toast.promise(
                              async () => {
                                const backup = structuredClone(data);
                                await mutate(
                                  (current: any) => {
                                    if (!current) return current;
                                    return {
                                      ...current,
                                      items: current.items.filter(
                                        (p: any) => p.id !== post.id
                                      ),
                                      total: current.total - 1,
                                    };
                                  },
                                  { revalidate: false }
                                );
                                try {
                                  const err = await deletePost(post.id);
                                  if (err) throw err;

                                  return true;
                                } catch (err) {
                                  await mutate(backup, { revalidate: false });
                                  throw err;
                                }
                              },
                              {
                                loading: "Đang xoá bài viết...",
                                success: "Đã xoá bài viết thành công!",
                                error: (err) => err,
                                richColors: true,
                              }
                            );
                          },
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  {isLoading ? "Đang tải..." : "Không có bài viết nào."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* PAGINATION */}
      <div className="flex justify-between items-center pt-4">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          variant="secondary"
        >
          ← Trang trước
        </Button>

        <div className="font-medium">
          Trang {page} / {totalPages || 1}
        </div>

        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          variant="secondary"
        >
          Trang tiếp →
        </Button>
      </div>
    </div>
  );
}
