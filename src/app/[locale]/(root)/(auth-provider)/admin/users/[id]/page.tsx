"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Calendar, MapPin, Shield } from "lucide-react";
import Image from "next/image";

export default function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [user] = useState({
    id: id,
    name: "Nguyễn Văn A",
    email: "user@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
    joinDate: "2024-01-15",
    status: "active",
    role: "user",
    posts: 45,
    comments: 128,
    followers: 342,
    following: 156,
    bio: "Yêu thích chia sẻ kiến thức và kết nối với mọi người",
    location: "Hà Nội, Việt Nam",
    website: "https://example.com",
    lastActive: "2 giờ trước",
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
          Chi tiết người dùng
        </h1>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <Image
                width={50}
                height={50}
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-24 h-24 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {user.name}
                  </h2>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                  >
                    {user.status === "active" ? "Hoạt động" : "Bị cấm"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{user.bio}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Tham gia: {user.joinDate}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Vai trò: {user.role}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Bài viết", value: user.posts },
              { label: "Bình luận", value: user.comments },
              { label: "Người theo dõi", value: user.followers },
              { label: "Đang theo dõi", value: user.following },
            ].map((stat) => (
              <Card key={stat.label} className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>

          {/* Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Hoạt động gần đây
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Đã đăng bài viết mới
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {i} ngày trước
                    </p>
                  </div>
                  <Badge variant="outline">Bài viết</Badge>
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
                onClick={() => router.push(`/admin/users/${id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => console.log("Ban user:", id)}
              >
                Cấm người dùng
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => console.log("Delete user:", id)}
              >
                Xóa tài khoản
              </Button>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Thông tin khác
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Hoạt động lần cuối</p>
                <p className="font-medium text-foreground">{user.lastActive}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID người dùng</p>
                <p className="font-mono text-xs text-foreground break-all">
                  {user.id}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
