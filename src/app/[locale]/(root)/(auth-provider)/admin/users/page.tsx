"use client";

import { useState, useEffect } from "react";
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Search, Plus, Users } from "lucide-react";
import { ActionMenu } from "@/components/admin/action-menu";
import { useAllUser } from "@/services/user.hook";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const [page, setPage] = useState(0);

  const { users, pagination, isLoading } = useAllUser({
    limit: 20,
    page,
    search: debounced,
  });

  useEffect(() => {
    if (page !== 0) setPage(0);
  }, [debounced, page]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Quản lý Người dùng
          </h1>
          <p className="text-muted-foreground mt-1">
            Tổng cộng{" "}
            <span className="font-semibold">{pagination?.total ?? 0}</span>{" "}
            người dùng
          </p>
        </div>

        <Button className="gap-2 shadow-md hover:shadow-lg">
          <Plus className="w-4 h-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* SEARCH BAR */}
      <Card className="p-4 shadow-sm border border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo username, email, tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden border shadow-sm rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 border-b">
              <TableHead className="py-4">Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Sở thích</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* LOADING SKELETON */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={6}>
                    <div className="h-6 bg-muted rounded w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {/* EMPTY */}
            {!isLoading && users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            )}

            {/* DATA LIST */}
            {!isLoading &&
              users.map((u) => (
                <TableRow
                  key={u.user_id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={u.avatar_url} />
                        <AvatarFallback>
                          {u.username?.slice(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium text-foreground">
                          @{u.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {u.firstName} {u.lastName}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.gender}</TableCell>

                  <TableCell>
                    {new Date(u.dob).toLocaleDateString("vi-VN")}
                  </TableCell>

                  <TableCell>
                    {u.favorites?.length ? (
                      <div className="flex gap-1 flex-wrap">
                        {u.favorites.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs px-2 py-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <ActionMenu
                      resourceId={u.username || ""}
                      resourceType="user"
                      actions={[
                        { label: "Xem hồ sơ", action: "view" },
                        { label: "Chỉnh sửa", action: "edit" },
                        {
                          label: "Xóa",
                          action: "custom",
                          variant: "destructive",
                          onCustomAction: () =>
                            console.log("Delete", u.username),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-4">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Trang trước
        </Button>

        <Button
          disabled={(page + 1) * 20 >= (pagination?.total || 0)}
          onClick={() => setPage((p) => p + 1)}
        >
          Trang tiếp
        </Button>
      </div>
    </div>
  );
}
