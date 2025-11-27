"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function UserEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn A",
    email: "user@example.com",
    bio: "Yêu thích chia sẻ kiến thức và kết nối với mọi người",
    location: "Hà Nội, Việt Nam",
    website: "https://example.com",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update user:", id, formData);
    router.push(`/admin/users/${id}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          Chỉnh sửa người dùng
        </h1>
      </div>

      {/* Form */}
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">
              Tên người dùng
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2"
              placeholder="Nhập tên người dùng"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2"
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Tiểu sử
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập tiểu sử"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Địa điểm
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-2"
              placeholder="Nhập địa điểm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Website
            </label>
            <Input
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="mt-2"
              placeholder="Nhập URL website"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit">Lưu thay đổi</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
