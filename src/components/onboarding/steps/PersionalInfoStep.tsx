"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import LayoutStep from "./LayoutStep";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "@/store/onboardingStore";
import { toast } from "sonner";
import { createUserSchema } from "@/types/user.type";

export default function PersonalInfoStep() {
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const gender = useOnboardingStore((state) => state.gender);
  const firstName = useOnboardingStore((state) => state.firstName);
  const lastName = useOnboardingStore((state) => state.lastName);
  const phone = useOnboardingStore((state) => state.phone);
  const address = useOnboardingStore((state) => state.address);
  const dob = useOnboardingStore((state) => state.dob);
  const setGender = useOnboardingStore((state) => state.setGender);
  const setPhone = useOnboardingStore((state) => state.setPhone);
  const setAddress = useOnboardingStore((state) => state.setAddress);

  const [localGender, setLocalGender] = useState(gender);
  const [localPhone, setLocalPhone] = useState(phone || "");
  const [localAddress, setLocalAddress] = useState(address || "");

  const genders = ["Nam", "Nữ", "Khác"];

  function handleNext() {
    if (!localGender) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân", {
        richColors: true,
      });
      return;
    }

    const partialUserSchema = createUserSchema.pick({
      phone: true,
      gender: true,
      address: true,
    });

    // Xác thực thông tin với createUserSchema
    const result = partialUserSchema.safeParse({
      phone: localPhone,
      address: localAddress,
      gender: localGender,
    });

    // Kiểm tra nếu có lỗi khi xác thực schema
    if (!result.success) {
      // Lấy lỗi đầu tiên để thông báo cho người dùng
      const errorMessage = result.error.errors[0].message;
      toast.error(errorMessage, {
        richColors: true,
      });
      return;
    }

    setGender(localGender);
    setPhone(localPhone);
    setAddress(localAddress);

    nextStep();
  }

  return (
    <LayoutStep isPrev={false} onClickNext={() => handleNext()}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>

        <div className="flex gap-4">
          {/* Họ */}
          <div className="space-y-1 w-1/3">
            <Label htmlFor="lastName" className="text-sm text-muted-foreground">
              Họ của bạn
            </Label>
            <Input
              type="text"
              id="lastName"
              placeholder="Nhập họ"
              value={lastName}
              disabled
              className="w-full"
            />
          </div>

          {/* Tên */}
          <div className="space-y-1 w-2/3">
            <Label
              htmlFor="firstName"
              className="text-sm text-muted-foreground"
            >
              Tên của bạn
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Nhập tên"
              value={firstName}
              disabled
              className="w-full"
            />
          </div>
        </div>

        {/* Ngày sinh */}
        <div className="space-y-1">
          <Label htmlFor="dob" className="text-sm text-muted-foreground">
            Ngày sinh
          </Label>
          <Input
            id="dob"
            type="date"
            min="1920-01-01"
            max={new Date().toISOString().split("T")[0]}
            value={
              new Date(dob.getTime() - dob.getTimezoneOffset() * 60000)
                .toISOString()
                .split("T")[0]
            }
            disabled
            className="w-full"
          />
        </div>

        {/* Giới tính */}
        <div className="space-y-1">
          <Label htmlFor="gender" className="text-sm text-muted-foreground">
            Giới tính
          </Label>
          <Select
            value={localGender}
            onValueChange={(value) =>
              setLocalGender(value as "Nam" | "Nữ" | "Khác")
            }
          >
            <SelectTrigger id="gender" className="w-full">
              <SelectValue placeholder="Chọn giới tính" />
            </SelectTrigger>
            <SelectContent>
              {genders.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Số điện thoại */}
        <div className="space-y-1">
          <Label htmlFor="phone" className="text-sm text-muted-foreground">
            Số điện thoại (Tùy chọn)
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={localPhone}
            onChange={(e) => setLocalPhone(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Địa chỉ */}
        <div className="space-y-1">
          <Label htmlFor="address" className="text-sm text-muted-foreground">
            Địa chỉ (Tùy chọn)
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="Nhập địa chỉ"
            value={localAddress}
            onChange={(e) => setLocalAddress(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </LayoutStep>
  );
}
