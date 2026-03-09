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
import { Search, AlertCircle } from "lucide-react";
import { ActionMenu } from "@/components/admin/action-menu";

const reports = [
  {
    id: "1",
    type: "Nội dung không phù hợp",
    reporter: "Nguyễn Văn A",
    target: "Bài viết #123",
    status: "pending",
    date: "2024-03-15",
  },
  {
    id: "2",
    type: "Spam",
    reporter: "Trần Thị B",
    target: "Bình luận #456",
    status: "resolved",
    date: "2024-03-14",
  },
  {
    id: "3",
    type: "Lạm dụng",
    reporter: "Lê Văn C",
    target: "Người dùng #789",
    status: "pending",
    date: "2024-03-13",
  },
  {
    id: "4",
    type: "Vi phạm bản quyền",
    reporter: "Phạm Thị D",
    target: "Bài viết #321",
    status: "resolved",
    date: "2024-03-12",
  },
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewDetails = (reportId: number) => {
    console.log("View report details:", reportId);
    // API call will be added here
  };

  const handleApproveReport = (reportId: number) => {
    console.log("Approve report:", reportId);
    // API call will be added here
  };

  const handleRejectReport = (reportId: number) => {
    console.log("Reject report:", reportId);
    // API call will be added here
  };

  const handleTakeAction = (reportId: number) => {
    console.log("Take action on report:", reportId);
    // API call will be added here
  };

  const filteredReports = reports.filter(
    (report) =>
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý Báo cáo</h1>
        <p className="text-muted-foreground mt-1">
          Tổng cộng {reports.length} báo cáo
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Chờ xử lý</p>
          <p className="text-2xl font-bold text-foreground mt-1">2</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Đã xử lý</p>
          <p className="text-2xl font-bold text-foreground mt-1">2</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng cộng</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {reports.length}
          </p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo loại hoặc người báo cáo..."
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
              <TableHead>Loại báo cáo</TableHead>
              <TableHead>Người báo cáo</TableHead>
              <TableHead>Đối tượng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày báo cáo</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  {report.type}
                </TableCell>
                <TableCell>{report.reporter}</TableCell>
                <TableCell className="text-sm">{report.target}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      report.status === "resolved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {report.status === "resolved" ? "Đã xử lý" : "Chờ xử lý"}
                  </span>
                </TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <ActionMenu
                    resourceId={report.id}
                    resourceType="report"
                    actions={[
                      {
                        label: "Xem chi tiết",
                        action: "view",
                      },
                      {
                        label: "Duyệt",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Approve report:", report.id),
                      },
                      {
                        label: "Từ chối",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Reject report:", report.id),
                        variant: "destructive",
                      },
                      {
                        label: "Thực hiện hành động",
                        action: "custom",
                        onCustomAction: () =>
                          console.log("Take action on report:", report.id),
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
