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
  const {
    firstName,
    lastName,
    dob,
    gender,
    phone,
    address,
    setFirstName,
    setLastName,
    setDob,
    setGender,
    setPhone,
    setAddress,
  } = useOnboardingStore();

  const [localFirstName, setLocalFirstName] = useState(firstName || "");
  const [localLastName, setLocalLastName] = useState(lastName || "");
  const [localDob, setLocalDob] = useState(
    dob ? dob.toISOString().split("T")[0] : ""
  );
  const [localGender, setLocalGender] = useState(gender || "");
  const [localPhone, setLocalPhone] = useState(phone || "");
  const [localAddress, setLocalAddress] = useState(address || "");

  const genders = ["Nam", "Nữ", "Khác"];

  function handleNext() {
    if (!localFirstName || !localLastName || !localDob || !localGender) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân", {
        richColors: true,
      });
      return;
    }

    const partialUserSchema = createUserSchema.pick({
      firstName: true,
      lastName: true,
      phone: true,
      gender: true,
      address: true,
      dob: true,
    });

    const result = partialUserSchema.safeParse({
      firstName: localFirstName,
      lastName: localLastName,
      phone: localPhone,
      gender: localGender,
      address: localAddress,
      dob: localDob,
    });

    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      toast.error(errorMessage, { richColors: true });
      return;
    }

    setFirstName(localFirstName);
    setLastName(localLastName);
    setDob(new Date(localDob));
    setGender(localGender as "Nam" | "Nữ" | "Khác");
    setPhone(localPhone);
    setAddress(localAddress);

    nextStep();
  }

  return (
    <LayoutStep isPrev={false} onClickNext={handleNext}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>

        {/* Họ và tên */}
        <div className="flex gap-4">
          <div className="space-y-1 w-1/3">
            <Label htmlFor="lastName" className="text-sm text-muted-foreground">
              Họ của bạn
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Nhập họ"
              value={localLastName}
              onChange={(e) => setLocalLastName(e.target.value)}
            />
          </div>

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
              value={localFirstName}
              onChange={(e) => setLocalFirstName(e.target.value)}
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
            value={localDob}
            onChange={(e) => setLocalDob(e.target.value)}
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
          />
        </div>
      </div>
    </LayoutStep>
  );
}
