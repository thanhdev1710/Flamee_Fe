"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { signinSchema } from "@/types/user.type";
import { Switch } from "../ui/switch";
import Link from "next/link";
import Image from "next/image";

export default function FormLogin() {
  const [isShowPass, setIsShowPass] = useState(false);
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(data: z.infer<typeof signinSchema>) {
    console.log("Submitted data:", data);
  }

  return (
    <div className="w-full space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
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
                <FormDescription>Nhập địa chỉ email của bạn.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isShowPass ? "text" : "password"}
                      placeholder="********"
                      {...field}
                    />
                    {isShowPass ? (
                      <EyeOff
                        onClick={() => setIsShowPass(false)}
                        className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400"
                      />
                    ) : (
                      <Eye
                        onClick={() => setIsShowPass(true)}
                        className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400"
                      />
                    )}
                  </div>
                </FormControl>
                <FormDescription>Nhập mật khẩu của bạn</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row-reverse items-center">
                  <div className="space-y-0.5">
                    <FormLabel>Ghi nhớ tôi</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Link
              href="/login/reset-password"
              className="--text-primary text-sm underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <button
            className="w-full --bg-primary text-white rounded-lg py-2 font-semibold cursor-pointer"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </Form>
      <hr />
      <div>
        <button className="bg-black flex gap-2 items-center justify-center text-white w-full py-2 rounded-lg">
          <Image
            alt="Logo Google"
            src="/assets/images/gg.webp"
            width={30}
            height={30}
          />
          <span>Hoặc đăng nhập với Google</span>
        </button>
        <div className="flex mt-3 items-center justify-center gap-1 text-sm">
          <p> Bạn chưa có tài khoản?</p>
          <Link href="/login/signup" className="--text-primary underline">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
