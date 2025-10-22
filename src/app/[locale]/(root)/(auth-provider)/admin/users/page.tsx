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
import { Search, Plus } from "lucide-react";
import { ActionMenu } from "@/components/admin/action-menu";

const users = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyena@example.com",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranb@example.com",
    status: "active",
    joinDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    status: "inactive",
    joinDate: "2024-02-01",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    status: "active",
    joinDate: "2024-02-10",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    email: "hoange@example.com",
    status: "banned",
    joinDate: "2024-02-15",
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewProfile = (userId: number) => {
    console.log("View profile for user:", userId);
    // API call will be added here
  };

  const handleEditUser = (userId: number) => {
    console.log("Edit user:", userId);
    // API call will be added here
  };

  const handleBanUser = (userId: number) => {
    console.log("Ban user:", userId);
    // API call will be added here
  };

  const handleUnbanUser = (userId: number) => {
    console.log("Unban user:", userId);
    // API call will be added here
  };

  const handleDeleteUser = (userId: number) => {
    console.log("Delete user:", userId);
    // API call will be added here
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "banned":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý Người dùng
          </h1>
          <p className="text-muted-foreground mt-1">
            Tổng cộng {users.length} người dùng
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
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
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status === "active"
                      ? "Hoạt động"
                      : user.status === "inactive"
                      ? "Không hoạt động"
                      : "Bị cấm"}
                  </span>
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>
                  <ActionMenu
                    resourceId={user.id}
                    resourceType="user"
                    actions={[
                      {
                        label: "Xem hồ sơ",
                        action: "view",
                      },
                      {
                        label: "Chỉnh sửa",
                        action: "edit",
                      },
                      {
                        label:
                          user.status === "banned"
                            ? "Bỏ cấm"
                            : "Cấm người dùng",
                        action: "custom",
                        onCustomAction: () =>
                          console.log(
                            user.status === "banned"
                              ? "Unban user:"
                              : "Ban user:",
                            user.id
                          ),
                        variant:
                          user.status === "banned" ? "default" : "destructive",
                      },
                      {
                        label: "Xóa",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Delete user:", user.id),
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
