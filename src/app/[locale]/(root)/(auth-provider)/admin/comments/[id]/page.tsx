"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function CommentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [comment] = useState({
    id,
    content:
      "Bài viết rất hay và bổ ích! Tôi đã học được rất nhiều điều mới từ bài viết này.",
    author: "Nguyễn Văn B",
    authorId: "user-2",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
    postId: "post-1",
    postTitle: "Cách tối ưu hóa hiệu suất React",
    createdAt: "2024-01-20",
    status: "approved",
    likes: 12,
    replies: 3,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          Chi tiết bình luận
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comment Card */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <Image
                width={50}
                height={50}
                src={comment.avatar}
                alt={comment.author}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-foreground">
                    {comment.author}
                  </p>
                  <Badge
                    variant={
                      comment.status === "approved" ? "default" : "secondary"
                    }
                  >
                    {comment.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {comment.createdAt}
                </p>
                <p className="text-foreground leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {comment.replies} trả lời
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {comment.likes} lượt thích
                </span>
              </div>
            </div>
          </Card>

          {/* Related Post */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Bài viết liên quan
            </h3>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Bài viết</p>
              <Button
                variant="link"
                className="p-0 h-auto text-foreground font-semibold"
                onClick={() => router.push(`/admin/posts/${comment.postId}`)}
              >
                {comment.postTitle}
              </Button>
            </div>
          </Card>

          {/* Replies */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Trả lời ({comment.replies})
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      width={50}
                      height={50}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=reply${i}`}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        Người dùng {i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i} ngày trước
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">
                    Cảm ơn bạn đã chia sẻ!
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Hành động
            </h3>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => router.push(`/admin/comments/${id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => console.log("Approve comment:", id)}
              >
                Duyệt bình luận
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => console.log("Hide comment:", id)}
              >
                Ẩn bình luận
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => console.log("Delete comment:", id)}
              >
                Xóa bình luận
              </Button>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Thông tin
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Tác giả</p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-foreground"
                  onClick={() =>
                    router.push(`/admin/users/${comment.authorId}`)
                  }
                >
                  {comment.author}
                </Button>
              </div>
              <div>
                <p className="text-muted-foreground">ID bình luận</p>
                <p className="font-mono text-xs text-foreground break-all">
                  {comment.id}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
