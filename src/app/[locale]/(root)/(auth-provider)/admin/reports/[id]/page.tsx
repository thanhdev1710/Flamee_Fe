"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function ReportDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [report] = useState({
    id: id,
    type: "inappropriate-content",
    reason: "Nội dung không phù hợp",
    description:
      "Bài viết này chứa nội dung xúc phạm và không phù hợp với cộng đồng",
    reportedBy: "Nguyễn Văn C",
    reportedById: "user-3",
    reportedContent: {
      type: "post",
      id: "post-1",
      title: "Bài viết bị báo cáo",
      author: "Nguyễn Văn A",
      authorId: "user-1",
    },
    createdAt: "2024-01-20",
    status: "pending",
    priority: "high",
    evidence: ["Lời lẽ xúc phạm", "Hình ảnh không phù hợp"],
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Chi tiết báo cáo</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {report.reason}
                </h2>
                <p className="text-muted-foreground">{report.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={
                    report.priority === "high" ? "destructive" : "secondary"
                  }
                >
                  {report.priority === "high" ? "Ưu tiên cao" : "Bình thường"}
                </Badge>
                <Badge
                  variant={
                    report.status === "pending" ? "secondary" : "default"
                  }
                >
                  {report.status === "pending" ? "Chờ xử lý" : "Đã xử lý"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Báo cáo bởi
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-foreground font-semibold"
                  onClick={() =>
                    router.push(`/admin/users/${report.reportedById}`)
                  }
                >
                  {report.reportedBy}
                </Button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Ngày báo cáo
                </p>
                <p className="font-medium text-foreground">
                  {report.createdAt}
                </p>
              </div>
            </div>
          </Card>

          {/* Reported Content */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Nội dung bị báo cáo
            </h3>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {report.reportedContent.type === "post"
                      ? "Bài viết"
                      : "Bình luận"}
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-foreground font-semibold"
                    onClick={() =>
                      router.push(
                        `/admin/${report.reportedContent.type}s/${report.reportedContent.id}`
                      )
                    }
                  >
                    {report.reportedContent.title}
                  </Button>
                </div>
                <Badge variant="outline">Xem chi tiết</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Tác giả:{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-foreground"
                  onClick={() =>
                    router.push(
                      `/admin/users/${report.reportedContent.authorId}`
                    )
                  }
                >
                  {report.reportedContent.author}
                </Button>
              </p>
            </div>
          </Card>

          {/* Evidence */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Bằng chứng
            </h3>
            <div className="space-y-2">
              {report.evidence.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  <p className="text-sm text-foreground">{item}</p>
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
                onClick={() => console.log("Approve report:", id)}
              >
                Duyệt báo cáo
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => console.log("Reject report:", id)}
              >
                Từ chối báo cáo
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => console.log("Take action:", id)}
              >
                Thực hiện hành động
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
                <p className="text-muted-foreground">Loại báo cáo</p>
                <p className="font-medium text-foreground">{report.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID báo cáo</p>
                <p className="font-mono text-xs text-foreground break-all">
                  {report.id}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
