/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Social Network",
    siteDescription: "Nền tảng mạng xã hội hiện đại",
    maintenanceMode: false,
    allowNewRegistration: true,
    requireEmailVerification: true,
    maxPostLength: 5000,
    maxCommentLength: 1000,
  });

  const handleSaveSettings = () => {
    console.log("Save settings:", settings);
    // API call will be added here
  };

  const handleResetSettings = () => {
    console.log("Reset settings to default");
    // API call will be added here
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cài đặt Hệ thống</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý cấu hình chung của trang web
        </p>
      </div>

      {/* General Settings */}
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Thông tin chung
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Tên trang web
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Mô tả trang web
              </label>
              <Input
                value={settings.siteDescription}
                onChange={(e) =>
                  handleChange("siteDescription", e.target.value)
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Feature Settings */}
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Cài đặt tính năng
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Chế độ bảo trì</p>
                <p className="text-sm text-muted-foreground">
                  Tạm dừng hoạt động của trang web
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(value) =>
                  handleChange("maintenanceMode", value)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Cho phép đăng ký mới
                </p>
                <p className="text-sm text-muted-foreground">
                  Cho phép người dùng mới tạo tài khoản
                </p>
              </div>
              <Switch
                checked={settings.allowNewRegistration}
                onCheckedChange={(value) =>
                  handleChange("allowNewRegistration", value)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Yêu cầu xác minh email
                </p>
                <p className="text-sm text-muted-foreground">
                  Bắt buộc xác minh email khi đăng ký
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(value) =>
                  handleChange("requireEmailVerification", value)
                }
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Content Limits */}
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Giới hạn nội dung
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Độ dài tối đa bài viết (ký tự)
              </label>
              <Input
                type="number"
                value={settings.maxPostLength}
                onChange={(e) =>
                  handleChange("maxPostLength", Number.parseInt(e.target.value))
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Độ dài tối đa bình luận (ký tự)
              </label>
              <Input
                type="number"
                value={settings.maxCommentLength}
                onChange={(e) =>
                  handleChange(
                    "maxCommentLength",
                    Number.parseInt(e.target.value)
                  )
                }
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleResetSettings}>
          Đặt lại
        </Button>
        <Button onClick={handleSaveSettings} className="gap-2">
          <Save className="w-4 h-4" />
          Lưu cài đặt
        </Button>
      </div>
    </div>
  );
}
