"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CommentEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [formData, setFormData] = useState({
    content:
      "Bài viết rất hay và bổ ích! Tôi đã học được rất nhiều điều mới từ bài viết này.",
    status: "approved",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update comment:", id, formData);
    router.push(`/admin/comments/${id}`);
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
          Chỉnh sửa bình luận
        </h1>
      </div>

      {/* Form */}
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">
              Nội dung bình luận
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Nhập nội dung bình luận"
              rows={6}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
              <option value="hidden">Ẩn</option>
            </select>
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
