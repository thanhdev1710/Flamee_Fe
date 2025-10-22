"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MessageCircle, Share2, Eye } from "lucide-react";
import Image from "next/image";

export default function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post] = useState({
    id: id,
    title: "Cách tối ưu hóa hiệu suất React",
    author: "Nguyễn Văn A",
    authorId: "user-1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/react-optimization.jpg",
    createdAt: "2024-01-20",
    status: "published",
    views: 1234,
    likes: 456,
    comments: 89,
    shares: 23,
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
          Chi tiết bài viết
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Card */}
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Image
                    width={50}
                    height={50}
                    src={post.avatar || "/placeholder.svg"}
                    alt={post.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.createdAt}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    post.status === "published" ? "default" : "secondary"
                  }
                >
                  {post.status === "published" ? "Đã xuất bản" : "Nháp"}
                </Badge>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">
              {post.title}
            </h2>

            <Image
              width={50}
              height={50}
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <p className="text-foreground leading-relaxed mb-6">
              {post.content}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-border">
              {[
                { icon: Eye, label: "Lượt xem", value: post.views },
                { icon: Heart, label: "Lượt thích", value: post.likes },
                {
                  icon: MessageCircle,
                  label: "Bình luận",
                  value: post.comments,
                },
                { icon: Share2, label: "Chia sẻ", value: post.shares },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Bình luận ({post.comments})
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      width={50}
                      height={50}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
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
                    Bình luận rất hay và bổ ích!
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
                onClick={() => router.push(`/admin/posts/${id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => console.log("Approve post:", id)}
              >
                Duyệt bài
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => console.log("Reject post:", id)}
              >
                Từ chối
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => console.log("Delete post:", id)}
              >
                Xóa bài viết
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
                  onClick={() => router.push(`/admin/users/${post.authorId}`)}
                >
                  {post.author}
                </Button>
              </div>
              <div>
                <p className="text-muted-foreground">ID bài viết</p>
                <p className="font-mono text-xs text-foreground break-all">
                  {post.id}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
