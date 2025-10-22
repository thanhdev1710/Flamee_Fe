/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Eye } from "lucide-react";
import { ActionMenu } from "@/components/admin/action-menu";

const posts = [
  {
    id: "1",
    title: "Bài viết về du lịch",
    author: "Nguyễn Văn A",
    views: 1250,
    likes: 89,
    status: "published",
    date: "2024-03-15",
  },
  {
    id: "2",
    title: "Chia sẻ kinh nghiệm lập trình",
    author: "Trần Thị B",
    views: 2340,
    likes: 156,
    status: "published",
    date: "2024-03-14",
  },
  {
    id: "3",
    title: "Mẹo nấu ăn hàng ngày",
    author: "Lê Văn C",
    views: 890,
    likes: 45,
    status: "draft",
    date: "2024-03-13",
  },
  {
    id: "4",
    title: "Review sản phẩm mới",
    author: "Phạm Thị D",
    views: 3100,
    likes: 234,
    status: "published",
    date: "2024-03-12",
  },
];

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewPost = (postId: number) => {
    console.log("View post:", postId);
    // API call will be added here
  };

  const handleEditPost = (postId: number) => {
    console.log("Edit post:", postId);
    // API call will be added here
  };

  const handleApprovePost = (postId: number) => {
    console.log("Approve post:", postId);
    // API call will be added here
  };

  const handleRejectPost = (postId: number) => {
    console.log("Reject post:", postId);
    // API call will be added here
  };

  const handleDeletePost = (postId: number) => {
    console.log("Delete post:", postId);
    // API call will be added here
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý Bài viết
          </h1>
          <p className="text-muted-foreground mt-1">
            Tổng cộng {posts.length} bài viết
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm bài viết
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề hoặc tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead>Lượt xem</TableHead>
              <TableHead>Lượt thích</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày đăng</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  {post.views}
                </TableCell>
                <TableCell>{post.likes}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      post.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {post.status === "published" ? "Đã đăng" : "Nháp"}
                  </span>
                </TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                  <ActionMenu
                    resourceId={post.id}
                    resourceType="post"
                    actions={[
                      {
                        label: "Xem bài viết",
                        action: "view",
                      },
                      {
                        label: "Chỉnh sửa",
                        action: "edit",
                      },
                      {
                        label: "Duyệt",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Approve post:", post.id),
                      },
                      {
                        label: "Từ chối",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Reject post:", post.id),
                        variant: "destructive",
                      },
                      {
                        label: "Xóa",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Delete post:", post.id),
                        variant: "destructive",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
