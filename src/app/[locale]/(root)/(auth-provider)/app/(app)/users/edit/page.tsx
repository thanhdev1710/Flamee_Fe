/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { User } from "lucide-react";
import { createUserSchema, CreateUserType } from "@/types/user.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CropImage from "@/components/shared/CropImage";
import { getMyProfiles } from "@/services/user.service";
import useSWR from "swr";
import { updateProfile } from "@/actions/user.action";

export default function EditProfilePage() {
  const { data: profile } = useSWR("my-profile", getMyProfiles);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CreateUserType>({
    resolver: zodResolver(createUserSchema) as Resolver<
      CreateUserType,
      any,
      CreateUserType
    >,
    defaultValues: {
      username: "@yourusername",
      email: "you@example.com",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      dob: new Date("2000-01-01"),
      gender: "Nam",
      favorites: [],
      avatar_url: "",
      bio: "",
      mssv: "",
      course: "",
      major: "",
    },
  });

  const fullName = `${form.watch("lastName") ?? ""} ${
    form.watch("firstName") ?? ""
  }`.trim();
  const initials = form.watch("username")?.[1]?.toUpperCase();

  const onSubmit: SubmitHandler<CreateUserType> = (values) => {
    const promise = (async () => {
      const err = await updateProfile(values);
      if (err) {
        throw err;
      }
      return true;
    })();

    toast.promise(promise, {
      loading: "Đang lưu thay đổi...",
      success: "Cập nhật hồ sơ thành công!",
      error: "Cập nhật hồ sơ thất bại. Vui lòng thử lại.",
    });
  };

  useEffect(() => {
    if (!profile) return;

    const safeProfile: CreateUserType = {
      ...profile,
      username: profile.username.replace("@", ""),
      dob: profile.dob ? new Date(profile.dob) : new Date("2000-01-01"),
      favorites: profile.favorites ?? [],
      avatar_url: profile.avatar_url ?? "",
      bio: profile.bio ?? "",
    };

    form.reset(safeProfile);
  }, [profile, form]);

  return (
    <ScrollArea className="h-full py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Chỉnh sửa hồ sơ
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Cập nhật thông tin cá nhân, học tập và giới thiệu bản thân.
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur">
          <CardContent className="p-6 sm:p-8 space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-10"
              >
                {/* Avatar + username/email */}
                <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                  {/* LEFT: Avatar + upload */}
                  <div className="w-full lg:w-5/12">
                    <FormField
                      control={form.control}
                      name="avatar_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Ảnh đại diện
                          </FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center gap-5 pt-3">
                              {/* Avatar preview */}
                              <div className="relative group">
                                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 shadow-2xl ring-4 ring-white/10 bg-background transition-all duration-300 group-hover:scale-105">
                                  <AvatarImage
                                    src={field.value || ""}
                                    alt={fullName}
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-2xl font-semibold">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 right-0 bg-black/70 p-1.5 rounded-full shadow-xl border border-white/10">
                                  <User className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>

                              {/* Upload (CropImage) – thu gọn, đẹp */}
                              <div className="w-full max-w-md mx-auto">
                                <CropImage
                                  imgDefault={field.value}
                                  aspect={1}
                                  isCircular
                                  action={async (file: File) => {
                                    if (!file || isUploading) return;
                                    setIsUploading(true);

                                    const formData = new FormData();
                                    formData.append("file", file);

                                    try {
                                      const res = await fetch(
                                        "/api/upload-cloud",
                                        {
                                          method: "POST",
                                          body: formData,
                                        }
                                      );

                                      if (!res.ok) {
                                        throw new Error("Upload failed");
                                      }

                                      const { url } = await res.json();
                                      field.onChange(url);

                                      toast.success(
                                        "Đã tải ảnh lên bấm lưu hồ sơ để cập nhật ảnh",
                                        {
                                          richColors: true,
                                        }
                                      );
                                    } catch (error) {
                                      console.error(error);
                                      toast.error(
                                        "Tải ảnh lên thất bại. Vui lòng thử lại.",
                                        { richColors: true }
                                      );
                                    } finally {
                                      setIsUploading(false);
                                    }
                                  }}
                                />
                              </div>

                              <p className="text-[11px] text-muted-foreground text-center">
                                Nên dùng ảnh vuông, rõ mặt, kích thước ≥
                                400×400. Ảnh sẽ được tải lên và lưu lại trong hồ
                                sơ của bạn.
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* RIGHT: username + email */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled
                                className="bg-muted/40 border-dashed cursor-not-allowed text-muted-foreground"
                              />
                            </FormControl>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Username không thể thay đổi.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled
                                className="bg-muted/40 border-dashed cursor-not-allowed text-muted-foreground"
                              />
                            </FormControl>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Email dùng để đăng nhập, không chỉnh tại đây.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-800/60" />

                {/* Thông tin cá nhân */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
                    <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      Thông tin cá nhân
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nguyễn" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Văn A" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="09xx xxx xxx" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Quận, Thành phố..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày sinh</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              value={
                                field.value
                                  ? format(field.value, "yyyy-MM-dd")
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : new Date("2000-01-01")
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giới tính</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Nam">Nam</SelectItem>
                                <SelectItem value="Nữ">Nữ</SelectItem>
                                <SelectItem value="Khác">Khác</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Thông tin học tập */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-emerald-500 via-cyan-500 to-blue-500" />
                    <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      Thông tin học tập
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="mssv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MSSV</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="10 chữ số" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Khóa học</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="2022-2026" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngành học</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Logistics, CNTT..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Giới thiệu */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500" />
                    <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      Giới thiệu
                    </h2>
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới thiệu bản thân</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Viết vài dòng về bản thân, mục tiêu, dự định..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                {/* Footer buttons */}
                <div className="flex items-center justify-between pt-2 gap-3">
                  <Link
                    href="/app/users"
                    className="inline-flex items-center max-sm:flex-col max-sm:text-center text-xs text-muted-foreground hover:text-foreground"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Xem trang cá nhân
                  </Link>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-full text-xs"
                      onClick={() => form.reset()}
                    >
                      Hủy thay đổi
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-gradient-to-r text-white from-blue-600 via-purple-600 to-pink-600 text-xs font-medium shadow-md hover:opacity-90"
                    >
                      Lưu hồ sơ
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="h-[90px]" />
    </ScrollArea>
  );
}
