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

export default function PersonalInfoStep() {
  const [gender, setLocalGender] = useState("");
  const [firstName, setLocalFirstName] = useState("");
  const [lastName, setLocalLastName] = useState("");
  const [email, setLocalEmail] = useState("");
  const [phone, setLocalPhone] = useState("");
  const [address, setLocalAddress] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");

  const genders = ["Nam", "Nữ", "Khác"];
  const countries = ["Việt Nam", "Mỹ", "Nhật Bản", "Hàn Quốc", "Ấn Độ"]; // Ví dụ quốc gia
  const maritalStatuses = ["Độc thân", "Đã kết hôn", "Ly dị", "Góa"];

  return (
    <LayoutStep onClickNext={() => console.log("Next step")} isPrev={false}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>

        <div className="flex gap-4">
          {/* Input Họ */}
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Họ của bạn</Label>
            <Input
              type="text"
              placeholder="Nhập họ"
              value={lastName}
              onChange={(e) => setLocalLastName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Input Tên */}
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Tên của bạn</Label>
            <Input
              type="text"
              placeholder="Nhập tên riêng"
              value={firstName}
              onChange={(e) => setLocalFirstName(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        {/* Input Email */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Email</Label>
          <Input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setLocalEmail(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Ngày sinh */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Ngày sinh</Label>
          <Input
            min={"1920-01-01"}
            max={new Date().toISOString().split("T")[0]}
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Giới tính */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Giới tính</Label>
          <Select
            value={gender}
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

        {/* Số điện thoại (Tùy chọn) */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">
            Số điện thoại (Tùy chọn)
          </Label>
          <Input
            type="tel"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setLocalPhone(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Địa chỉ (Tùy chọn) */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">
            Địa chỉ (Tùy chọn)
          </Label>
          <Input
            type="text"
            placeholder="Nhập địa chỉ"
            value={address}
            onChange={(e) => setLocalAddress(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Quốc gia */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Quốc gia</Label>
          <Select value={country} onValueChange={(value) => setCountry(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn quốc gia" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tình trạng hôn nhân */}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">
            Tình trạng hôn nhân
          </Label>
          <Select
            value={maritalStatus}
            onValueChange={(value) => setMaritalStatus(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn tình trạng hôn nhân" />
            </SelectTrigger>
            <SelectContent>
              {maritalStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </LayoutStep>
  );
}
