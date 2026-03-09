/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  FileIcon,
} from "lucide-react";

import Image from "next/image";
import { useInteractions, usePostDetail } from "@/services/post.hook";
import { use } from "react";
import { deletePost } from "@/actions/post.action";
import { toast } from "sonner";
import { Post } from "@/types/post.type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { mutate } from "swr";

export default function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  // ---- FETCH REAL DATA ----
  const { data: post, isLoading, error } = usePostDetail(id);
  const { data: interactions } = useInteractions(id);

  if (isLoading)
    return (
      <p className="p-6 text-muted-foreground animate-pulse">
        Đang tải bài viết...
      </p>
    );

  if (error || !post)
    return (
      <p className="p-6 text-red-500">
        Không thể tải bài viết hoặc bài viết không tồn tại.
      </p>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Chi tiết bài viết</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author_avatar} />
                  <AvatarFallback>{post.author_username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {post.author_username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <Badge
                variant={
                  post.visibility === "public"
                    ? "default"
                    : post.visibility === "friends"
                    ? "secondary"
                    : "outline"
                }
              >
                {post.visibility === "public"
                  ? "Công khai"
                  : post.visibility === "friends"
                  ? "Bạn bè"
                  : "Riêng tư"}
              </Badge>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold">{post.title}</h2>

            {/* Content */}
            {post.content && (
              <p className="leading-relaxed whitespace-pre-line text-[15px] text-foreground/90">
                {post.content}
              </p>
            )}

            {/* Media */}
            <div className="space-y-4">
              {/* Images */}
              {post.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.images.map((img) => (
                    <Image
                      key={img.mediaUrl}
                      src={img.mediaUrl}
                      alt=""
                      width={600}
                      height={400}
                      className="rounded-lg w-full object-cover shadow-md hover:scale-[1.02] transition"
                    />
                  ))}
                </div>
              )}

              {/* Videos (URL based) */}
              {post.videos.length > 0 && (
                <div className="space-y-4">
                  {post.videos.map((video) => (
                    <video
                      key={video.mediaUrl}
                      controls
                      preload="metadata"
                      className="w-full rounded-lg shadow-md border"
                    >
                      <source src={video.mediaUrl} />
                    </video>
                  ))}
                </div>
              )}

              {/* Files */}
              {post.files.length > 0 && (
                <div className="space-y-2">
                  {post.files.map((file) => (
                    <a
                      key={file.mediaUrl}
                      href={file.mediaUrl}
                      target="_blank"
                      className="flex items-center gap-2 text-blue-600 underline hover:text-blue-800"
                    >
                      <FileIcon className="w-4 h-4" />
                      {file.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-border">
              {[
                { icon: Eye, label: "Lượt xem", value: post.score },
                { icon: Heart, label: "Lượt thích", value: post.like_count },
                {
                  icon: MessageCircle,
                  label: "Bình luận",
                  value: post.comment_count,
                },
                { icon: Share2, label: "Chia sẻ", value: post.share_count },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Comments */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Bình luận ({interactions?.comments.length || 0})
            </h3>

            {!interactions || interactions.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Chưa có bình luận nào.
              </p>
            ) : (
              <div className="space-y-4">
                {interactions.comments.map((c) => (
                  <CommentItem key={c.id} comment={c} />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <SidebarInfo post={post} id={id} router={router} />
      </div>
    </div>
  );
}

/* ================================
   COMMENT ITEM (support replies)
================================= */

function CommentItem({ comment }: any) {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatarUrl} />
          <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{comment.user.username}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      <p className="text-sm text-foreground">{comment.content}</p>

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-8 mt-3 space-y-3 border-l pl-4 border-border/40">
          {comment.replies.map((reply: any) => (
            <div key={reply.id}>
              <div className="flex items-center gap-3 mb-1">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={reply.user.avatarUrl} />
                  <AvatarFallback>{reply.user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{reply.user.username}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <p className="text-sm">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================
         SIDEBAR ACTIONS
================================= */

function SidebarInfo({
  post,
  id,
  router,
}: {
  post: Post;
  id: string;
  router: AppRouterInstance;
}) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hành động</h3>
        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={() => router.push(`/admin/posts/${id}/edit`)}
          >
            Chỉnh sửa
          </Button>
          {/* <Button variant="outline" className="w-full">
            Duyệt bài
          </Button>
          <Button variant="outline" className="w-full">
            Từ chối
          </Button> */}
          <Button
            onClick={() => {
              toast.promise(
                deletePost(id), // promise chạy API xoá
                {
                  loading: "Đang xoá bài viết...",
                  success: async () => {
                    await mutate((key) => {
                      console.log(
                        "key:::",
                        key,
                        Array.isArray(key) && key[0] === "admin-posts"
                      );
                      return Array.isArray(key) && key[0] === "admin-posts";
                    });

                    router.replace("/admin/posts");
                    return "Đã xoá bài viết thành công!";
                  },
                  error: (err) =>
                    typeof err === "string"
                      ? err
                      : "Không thể xoá bài viết. Vui lòng thử lại!",
                  richColors: true,
                }
              );
            }}
            variant="destructive"
            className="w-full"
          >
            Xóa bài viết
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-3">Thông tin</h3>
        <div className="space-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Tác giả</p>
            <p className="text-foreground">{post.author_username}</p>
          </div>

          <div>
            <p className="text-muted-foreground">ID bài viết</p>
            <p className="text-xs font-mono break-all">{post.id}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Ngày tạo</p>
            <p>{new Date(post.created_at).toLocaleString("vi-VN")}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
