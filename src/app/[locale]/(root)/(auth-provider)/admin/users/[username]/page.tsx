"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Calendar, MapPin, Shield, Heart } from "lucide-react";
import Image from "next/image";
import { useProfileByUsername } from "@/services/user.hook";

export default function UserDetail({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const router = useRouter();

  // ============ FETCH REAL DATA ============
  const { data: user, isLoading, error } = useProfileByUsername(username);

  console.log(user);

  // ============ LOADING ============
  if (isLoading)
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="h-6 w-40 bg-muted rounded"></div>
        <Card className="h-40 bg-muted" />
        <Card className="h-40 bg-muted" />
      </div>
    );

  // ============ ERROR ============
  if (error || !user)
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </Button>
        <Card className="p-6 text-center text-red-500 font-semibold">
          Không tìm thấy người dùng!
        </Card>
      </div>
    );

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <Image
                width={100}
                height={100}
                src={user.avatar_url}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">@{user.username}</h2>
                  <Badge variant="default">Hoạt động</Badge>
                </div>

                {user.bio && (
                  <p className="text-muted-foreground mb-4">{user.bio}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Ngày sinh: {new Date(user.dob).toLocaleDateString("vi-VN")}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Giới tính: {user.gender}
                  </div>

                  {user.address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {user.address}
                    </div>
                  )}
                </div>

                {/* Favorites */}
                {user.favorites && user.favorites.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {user.favorites.map((fav, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        <Heart className="w-3 h-3 text-red-500" /> {fav}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Bài viết", value: 0 },
              { label: "Bình luận", value: 0 },
              { label: "Follower", value: 0 },
              { label: "Following", value: 0 },
            ].map((stat) => (
              <Card key={stat.label} className="p-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
            <p className="text-sm text-muted-foreground">
              Tính năng này sẽ được cập nhật sau.
            </p>
          </Card>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Hành động</h3>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => router.push(`/admin/users/${username}/edit`)}
              >
                Chỉnh sửa
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => console.log("Ban:", user.user_id)}
              >
                Cấm người dùng
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => console.log("Delete:", user.user_id)}
              >
                Xóa tài khoản
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold mb-3">Thông tin khác</h3>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">ID người dùng</p>
                <p className="font-mono text-xs break-all">{user.user_id}</p>
              </div>

              {user.created_at && (
                <div>
                  <p className="text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
