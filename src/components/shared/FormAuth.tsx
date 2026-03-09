"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Switch } from "../ui/switch";
import Link from "next/link";
import { AuthFormData, authSchema, FormType } from "@/types/formAuth.type";

import { PasswordTooltip } from "./PasswordTooltip";
import PasswordStrength from "./PasswordStrength";
import {
  checkSession,
  resetPassword,
  sendResetPassword,
  signin,
  signup,
} from "@/actions/auth.action";
import FullScreenLoader from "../loading/FullScreenLoader";
import { toast } from "sonner";
import ButtonSignin from "./ButtonSignin";

export default function FormAuth({
  type,
  token,
}: {
  type: FormType;
  token?: string;
}) {
  const [isShowPass, setIsShowPass] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const textPrimary: { [key in FormType]: string } = {
    signin: "Rất vui được gặp lại bạn 👋",
    signup: "Chào mừng bạn đến với cộng đồng! 🎉",
    "reset-password": "Đặt lại mật khẩu của bạn 🔒",
    "send-reset-password": "Kiểm tra email để khôi phục mật khẩu ✉️",
  };

  const textSubmit: { [key in FormType]: string } = {
    "reset-password": "Đổi mật khẩu",
    "send-reset-password": "Gửi",
    signin: "Đăng nhập",
    signup: "Đăng ký",
  };

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues:
      type === "signin"
        ? {
            email: "",
            password: "",
            rememberMe: false,
            type: "signin",
          }
        : type === "signup"
        ? {
            email: "",
            password: "",
            confirmPassword: "",
            confirmPolicy: false,
            type: "signup",
          }
        : type === "send-reset-password"
        ? {
            email: "",
            type: "send-reset-password",
          }
        : {
            password: "",
            confirmPassword: "",
            type: "reset-password",
          },
  });

  async function onSubmit(data: AuthFormData) {
    setIsSubmitLoading(true);
    let error: string | null = null;

    switch (data.type) {
      case "signin": {
        error = await signin(data);
        if (!error) {
          toast.success("Đăng nhập thành công!");
          await checkSession("/app/feeds");
        }
        break;
      }
      case "signup": {
        error = await signup(data);
        if (!error) {
          toast.success("Đăng ký thành công!");
          await checkSession("/auth/verify-email");
        }
        break;
      }
      case "send-reset-password": {
        error = await sendResetPassword(data);
        if (!error) toast.success("Đã gửi email khôi phục mật khẩu!");
        break;
      }
      case "reset-password": {
        if (!token) {
          toast.error("Không có token", { richColors: true });
        } else {
          error = await resetPassword(data, token);
          if (!error) toast.success("Đổi mật khẩu thành công!");
        }
        break;
      }
      default:
        error = "Đã xảy ra lỗi không xác định";
    }

    if (error) toast.error(error.toUpperCase(), { richColors: true });

    setTimeout(() => setIsSubmitLoading(false), 300);
  }

  return (
    <>
      <div className="w-full space-y-6 mt-6 mb-3">
        <h2 className="font-semibold text-2xl">{textPrimary[type]}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            {type !== "reset-password" && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập địa chỉ email của bạn.
                    </FormDescription>
                    {type === "signup" && <FormMessage />}
                  </FormItem>
                )}
              />
            )}

            {/* Password */}
            {type !== "send-reset-password" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="w-full flex justify-between items-center">
                        <p>Mật khẩu</p>
                        {type === "signup" && (
                          <PasswordTooltip password={field.value || ""} />
                        )}
                      </div>
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={isShowPass ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      {isShowPass ? (
                        <EyeOff
                          onClick={() => setIsShowPass(false)}
                          className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 cursor-pointer"
                        />
                      ) : (
                        <Eye
                          onClick={() => setIsShowPass(true)}
                          className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 cursor-pointer"
                        />
                      )}
                    </div>
                    <FormDescription>Nhập mật khẩu của bạn</FormDescription>
                    {type === "signup" && (
                      <>
                        <PasswordStrength password={field.value || ""} />
                        <FormMessage />
                      </>
                    )}
                  </FormItem>
                )}
              />
            )}
            {/* Confirm Password nếu là đăng ký */}
            {(type === "signup" || type === "reset-password") && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Xác nhận lại mật khẩu</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Confirm Policy nếu là đăng ký */}
            {type === "signup" && (
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="confirmPolicy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row-reverse items-center gap-2">
                      <FormLabel>Tôi đồng ý với chính sách bảo mật</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-flame-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Remember me nếu là đăng nhập */}
            {type === "signin" && (
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row-reverse items-center gap-2">
                      <FormLabel>Ghi nhớ tôi</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-flame-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Link
                  href="/auth/reset-password"
                  className="text-flame-primary underline"
                  aria-label="Quên mật khẩu?"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <button
              className="w-full bg-flame-primary text-white rounded-lg py-2 font-semibold cursor-pointer"
              type="submit"
            >
              {textSubmit[type]}
            </button>
          </form>
        </Form>

        {type !== "reset-password" && (
          <>
            <hr />

            <div>
              <ButtonSignin type={type} />
              <div className="flex mt-3 items-center justify-center gap-1">
                <p>
                  {type === "signin"
                    ? "Bạn chưa có tài khoản?"
                    : "Bạn đã có tài khoản?"}
                </p>
                <Link
                  href={type === "signin" ? "/auth/signup" : "/auth/signin"}
                  className="text-flame-primary underline"
                  aria-label={type === "signin" ? "Đăng ký" : "Đăng nhập"}
                >
                  {type === "signin" ? "Đăng ký" : "Đăng nhập"}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
      {isSubmitLoading && <FullScreenLoader />}
    </>
  );
}
