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
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import "react-day-picker/dist/style.css";

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
    setPhone,
    setAddress,
  } = useOnboardingStore();

  const [localFirstname, setLocalFirstname] = useState(firstName);
  const [localLastname, setLocalLastname] = useState(lastName);
  const [localDob, setLocalDob] = useState<Date>(dob);
  const [localGender, setLocalGender] = useState(gender);
  const [localPhone, setLocalPhone] = useState(phone || "");
  const [localAddress, setLocalAddress] = useState(address || "");

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const minDate = new Date(1920, 0, 1);

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

    const result = partialUserSchema.safeParse({
      phone: localPhone,
      address: localAddress,
      gender: localGender,
    });

    if (!result.success) {
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
    <LayoutStep isPrev={false} onClickNext={handleNext}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
        <div className="flex gap-4">
          <div className="space-y-1 w-1/3">
            <Label htmlFor="lastName" className="text-sm text-muted-foreground">
              Họ của bạn
            </Label>
            <Input
              autoFocus
              type="text"
              id="lastName"
              placeholder="Nhập họ"
              value={localLastname}
              onChange={(e) => setLocalLastname(e.target.value)}
              className="w-full"
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
              value={localFirstname}
              onChange={(e) => setLocalFirstname(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="dob" className="text-sm text-muted-foreground">
            Ngày sinh
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !localDob && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localDob
                  ? format(localDob, "dd/MM/yyyy", { locale: vi })
                  : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                locale={vi}
                selected={localDob}
                onSelect={(date) => date && setLocalDob(date)}
                fromDate={minDate}
                toDate={eighteenYearsAgo}
                captionLayout="dropdown"
                initialFocus
                classNames={{
                  caption_dropdowns: "flex items-center gap-5",
                  day_outside: "opacity-50 text-muted-foreground",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

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
