"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, MailCheck } from "lucide-react";
import { Logout, verifyEmail } from "@/actions/auth.action";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerifyEmail = async () => {
    const { token } = await params;
    setVerifying(true);

    try {
      const err = await verifyEmail(token);

      if (err) {
        toast.error(err.toUpperCase(), { richColors: true });
        return;
      }
      setVerified(true);
    } catch {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.", { richColors: true });
    } finally {
      setVerifying(false);
      await Logout();
      redirect("/auth/signin");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full space-y-6 text-center">
      <MailCheck className="text-green-500" size={48} />
      <h1 className="text-2xl font-bold">Xác thực email</h1>
      <p className="max-w-md">
        Tài khoản của bạn chưa được xác thực. Bấm nút bên dưới để tiến hành xác
        thực và sử dụng đầy đủ chức năng.
      </p>

      {!verified ? (
        <Button
          onClick={handleVerifyEmail}
          disabled={verifying}
          className="w-full"
        >
          {verifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xác nhận...
            </>
          ) : (
            "Xác nhận email"
          )}
        </Button>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <CheckCircle2 className="text-green-500" size={32} />
          <p className="text-green-600 font-medium">
            Xác thực email thành công!
          </p>
        </div>
      )}
    </div>
  );
}
