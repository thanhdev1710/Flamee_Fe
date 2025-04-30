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

export default function PersonalInfoStep() {
  const {
    nextStep,
    gender,
    firstName,
    lastName,
    phone,
    address,
    dob,
    setGender,
    setFirstName,
    setLastName,
    setPhone,
    setAddress,
    setDob,
  } = useOnboardingStore();

  const [localGender, setLocalGender] = useState(gender || "");
  const [localFirstName, setLocalFirstName] = useState(firstName || "");
  const [localLastName, setLocalLastName] = useState(lastName || "");
  const [localPhone, setLocalPhone] = useState(phone || "");
  const [localAddress, setLocalAddress] = useState(address || "");
  const [localDob, setLocalDob] = useState(
    dob ? new Date(dob).toISOString().split("T")[0] : ""
  );

  const genders = ["Nam", "Nữ", "Khác"];

  function handleNext() {
    if (!localGender || !localFirstName || !localLastName || !localDob) {
      toast.error("Vui lòng điền đầy đủ thông tin cá nhân", {
        richColors: true,
      });
      return;
    }

    setGender(localGender);
    setFirstName(localFirstName);
    setLastName(localLastName);
    setPhone(localPhone);
    setAddress(localAddress);
    setDob(new Date(localDob).getTime());

    nextStep();
  }

  return (
    <LayoutStep onClickNext={handleNext} isPrev={false}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>

        <div className="flex gap-4">
          {/* Họ */}
          <div className="space-y-1 w-1/3">
            <Label className="text-sm text-muted-foreground">Họ của bạn</Label>
            <Input
              type="text"
              placeholder="Nhập họ"
              value={localLastName}
              onChange={(e) => setLocalLastName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Tên */}
          <div className="space-y-1 w-2/3">
            <Label className="text-sm text-muted-foreground">Tên của bạn</Label>
            <Input
              type="text"
              placeholder="Nhập tên"
              value={localFirstName}
              onChange={(e) => setLocalFirstName(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Ngày sinh */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Ngày sinh</Label>
          <Input
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
          <Label className="text-sm text-muted-foreground">Giới tính</Label>
          <Select
            value={localGender}
            onValueChange={(value) => setLocalGender(value)}
          >
            <SelectTrigger className="w-full">
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
          <Label className="text-sm text-muted-foreground">
            Số điện thoại (Tùy chọn)
          </Label>
          <Input
            type="tel"
            placeholder="Nhập số điện thoại"
            value={localPhone}
            onChange={(e) => setLocalPhone(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Địa chỉ */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">
            Địa chỉ (Tùy chọn)
          </Label>
          <Input
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
