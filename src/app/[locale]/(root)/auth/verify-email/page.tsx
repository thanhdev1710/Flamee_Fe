"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { getMe, sendVerifyEmail } from "@/actions/auth.action";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);
      const { user } = await getMe();

      if (!user?.email) {
        toast.error("Không tìm thấy email người dùng.", { richColors: true });
        return;
      }

      const err = await sendVerifyEmail(user.email);

      if (err) {
        toast.error(err.toUpperCase(), { richColors: true });
        return;
      }

      setSuccess(true);
    } catch {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.", { richColors: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full space-y-6 text-center">
      <Mail className="text-yellow-500" size={48} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Vui lòng xác thực email
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        Tài khoản của bạn chưa được xác thực. Hãy kiểm tra hộp thư đến (hoặc thư
        rác) để hoàn tất xác thực email và sử dụng đầy đủ chức năng.
      </p>

      {!success ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Không nhận được email?
          </p>
          <Button onClick={handleResend} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi lại...
              </>
            ) : (
              "Gửi lại email xác thực"
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <CheckCircle2 className="text-green-500" size={32} />
          <p className="text-green-600 font-medium">
            Email xác thực đã được gửi lại thành công!
          </p>
        </div>
      )}
    </div>
  );
}
