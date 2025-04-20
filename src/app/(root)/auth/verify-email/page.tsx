"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MailWarning, Loader2, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await fetch("https://a.com/api/auth/resend-verification", {
        method: "POST",
      });

      setResent(true);
    } catch (error) {
      console.error("Error resending email:", error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full space-y-6 text-center">
      <MailWarning className="text-yellow-500" size={48} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Vui lòng xác thực email
      </h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        Tài khoản của bạn chưa được xác thực. Hãy kiểm tra hộp thư đến (hoặc thư
        rác) để hoàn tất xác thực email và sử dụng đầy đủ chức năng.
      </p>

      {!resent ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Không nhận được email?
          </p>
          <Button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full"
          >
            {resending ? (
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
