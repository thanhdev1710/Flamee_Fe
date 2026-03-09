/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
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
import { updateProfileByUsername } from "@/actions/user.action";
import { useProfileByUsername } from "@/services/user.hook";
import { useRouter } from "next/navigation";

export default function AdminEditProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const router = useRouter();
  const { data: profile } = useProfileByUsername(username);
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
      const err = await updateProfileByUsername(username, values);
      if (err) throw err;
      return true;
    })();

    toast.promise(promise, {
      loading: "Đang lưu thay đổi...",
      success: () => {
        router.replace(`/admin/users/${username}`);
        return "Cập nhật hồ sơ thành công!";
      },
      error: "Cập nhật hồ sơ thất bại. Vui lòng thử lại.",
    });
  };

  // 🌟 RESET giữ nguyên username + email
  useEffect(() => {
    if (!profile) return;

    const safeProfile: CreateUserType = {
      ...profile,
      username: profile.username.replace("@", ""),
      email: profile.email,
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
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Chỉnh sửa hồ sơ
          </h1>
          <p className="text-sm text-muted-foreground">
            Cập nhật thông tin cá nhân, học tập và giới thiệu bản thân.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-linear-to-br from-background to-muted/20 backdrop-blur">
          <CardContent className="p-6 sm:p-8 space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-10"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Avatar */}
                  <div className="w-full lg:w-5/12">
                    <FormField
                      control={form.control}
                      name="avatar_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ảnh đại diện</FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center gap-5 pt-3">
                              <Avatar className="w-28 h-28 shadow-xl ring-4 ring-white/10">
                                <AvatarImage
                                  src={field.value || ""}
                                  alt={fullName}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-2xl">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>

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
                                      "/api/upload-local",
                                      {
                                        method: "POST",
                                        body: formData,
                                      }
                                    );
                                    if (!res.ok)
                                      throw new Error("Upload failed");

                                    const { url } = await res.json();
                                    field.onChange(url);

                                    toast.success("Ảnh đã được tải lên!");
                                  } catch {
                                    toast.error("Không thể tải ảnh.");
                                  } finally {
                                    setIsUploading(false);
                                  }
                                }}
                              />

                              <p className="text-[11px] text-muted-foreground text-center">
                                Ảnh nên ≥ 400×400px để hiển thị tốt nhất.
                              </p>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Username + Email */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-4">
                      {/* Username */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                className="bg-muted/40 border-dashed cursor-not-allowed text-muted-foreground"
                              />
                            </FormControl>
                            <p className="text-[11px] text-muted-foreground">
                              Username không thể thay đổi.
                            </p>
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                className="bg-muted/40 border-dashed cursor-not-allowed text-muted-foreground"
                              />
                            </FormControl>
                            <p className="text-[11px] text-muted-foreground">
                              Email dùng để đăng nhập, không chỉnh tại đây.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ==========================
                    THÔNG TIN CÁ NHÂN
                =========================== */}
                <section className="space-y-4">
                  <h2 className="font-semibold text-muted-foreground text-sm uppercase">
                    Thông tin cá nhân
                  </h2>

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
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* ==========================
                    THÔNG TIN HỌC TẬP
                =========================== */}
                <section className="space-y-4">
                  <h2 className="font-semibold text-muted-foreground text-sm uppercase">
                    Thông tin học tập
                  </h2>

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
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Khóa</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="2022-2026" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="major"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngành</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="CNTT, Logistics..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* ==========================
                    GIỚI THIỆU
                =========================== */}
                <section className="space-y-4">
                  <h2 className="font-semibold text-muted-foreground text-sm uppercase">
                    Giới thiệu
                  </h2>

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
                            placeholder="Viết vài dòng về bản thân..."
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </section>

                {/* BUTTONS */}
                <div className="flex justify-between pt-2">
                  <Link
                    href="/app/users"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    <User className="w-4 h-4 inline mr-1" />
                    Xem trang cá nhân
                  </Link>

                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => form.reset()}>
                      Hủy
                    </Button>

                    <Button
                      type="submit"
                      className="rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white"
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
    </ScrollArea>
  );
}
