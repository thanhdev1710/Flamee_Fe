/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { ActionMenu } from "@/components/admin/action-menu";

const comments = [
  {
    id: "1",
    author: "Nguyễn Văn A",
    content: "Bài viết rất hay!",
    post: "Bài viết về du lịch",
    status: "approved",
    date: "2024-03-15",
  },
  {
    id: "2",
    author: "Trần Thị B",
    content: "Cảm ơn bạn đã chia sẻ",
    post: "Chia sẻ kinh nghiệm lập trình",
    status: "approved",
    date: "2024-03-14",
  },
  {
    id: "3",
    author: "Lê Văn C",
    content: "Spam content...",
    post: "Mẹo nấu ăn hàng ngày",
    status: "pending",
    date: "2024-03-13",
  },
  {
    id: "4",
    author: "Phạm Thị D",
    content: "Quá tuyệt vời!",
    post: "Review sản phẩm mới",
    status: "approved",
    date: "2024-03-12",
  },
];

export default function CommentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewComment = (commentId: number) => {
    console.log("View comment:", commentId);
    // API call will be added here
  };

  const handleEditComment = (commentId: number) => {
    console.log("Edit comment:", commentId);
    // API call will be added here
  };

  const handleApproveComment = (commentId: number) => {
    console.log("Approve comment:", commentId);
    // API call will be added here
  };

  const handleRejectComment = (commentId: number) => {
    console.log("Reject comment:", commentId);
    // API call will be added here
  };

  const handleHideComment = (commentId: number) => {
    console.log("Hide comment:", commentId);
    // API call will be added here
  };

  const handleDeleteComment = (commentId: number) => {
    console.log("Delete comment:", commentId);
    // API call will be added here
  };

  const filteredComments = comments.filter(
    (comment) =>
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Quản lý Bình luận
        </h1>
        <p className="text-muted-foreground mt-1">
          Tổng cộng {comments.length} bình luận
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tác giả hoặc nội dung..."
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
              <TableHead>Tác giả</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Bài viết</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày bình luận</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className="font-medium">{comment.author}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {comment.content}
                </TableCell>
                <TableCell className="text-sm">{comment.post}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      comment.status === "approved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {comment.status === "approved" ? "Duyệt" : "Chờ duyệt"}
                  </span>
                </TableCell>
                <TableCell>{comment.date}</TableCell>
                <TableCell>
                  <ActionMenu
                    resourceId={comment.id}
                    resourceType="comment"
                    actions={[
                      {
                        label: "Xem bình luận",
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
                          console.log("Approve comment:", comment.id),
                      },
                      {
                        label: "Từ chối",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Reject comment:", comment.id),
                        variant: "destructive",
                      },
                      {
                        label: "Ẩn",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Hide comment:", comment.id),
                      },
                      {
                        label: "Xóa",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Delete comment:", comment.id),
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
