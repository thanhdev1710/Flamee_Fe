import { z } from "zod";

export interface SearchUsername {
  user_id: string;
  username: string;
  avatar_url: string;
  isFollowed: boolean;
}

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(50, "Username tối đa 50 ký tự")
    .regex(
      /^(?!.*[_.]{2})(?![_.])[a-zA-Z0-9._]+(?<![_.])$/,
      "Username chỉ được chứa chữ cái, số, dấu _ và ., không được bắt đầu/kết thúc bằng _ hoặc ., và không có dấu liên tiếp"
    ),
  firstName: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên tối đa 50 ký tự"),

  lastName: z
    .string()
    .min(2, "Họ phải có ít nhất 2 ký tự")
    .max(50, "Họ tối đa 50 ký tự"),

  phone: z.string().optional(),

  address: z.string().optional(),

  dob: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val);
      }
    },
    z.date({
      required_error: "Ngày sinh là bắt buộc",
      invalid_type_error: "Ngày sinh không hợp lệ",
    })
  ),

  gender: z.enum(["Nam", "Nữ", "Khác"], {
    required_error: "Giới tính là bắt buộc",
  }),

  favorites: z
    .array(z.string())
    .max(5, "Bạn chỉ có thể chọn tối đa 5 sở thích"),

  avatar_url: z.string(),

  bio: z.string().max(500, "Giới thiệu bản thân tối đa 500 ký tự").optional(),

  mssv: z.string().regex(/^\d{10}$/, "Mã số sinh viên phải là chuỗi 10 chữ số"),

  course: z
    .string()
    .regex(
      /^\d{4}-\d{4}$/,
      "Khóa học phải theo định dạng YYYY-YYYY (ví dụ: 2022-2026)"
    ),

  major: z
    .string()
    .min(2, "Ngành học phải có ít nhất 2 ký tự")
    .max(100, "Ngành học tối đa 100 ký tự"),
});

export type CreateUserType = z.infer<typeof createUserSchema>;

export interface CreateUserStateType extends CreateUserType {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setPhone: (phone: string) => void;
  setAddress: (address: string) => void;
  setDob: (dob: Date) => void;
  setGender: (gender: "Nam" | "Nữ" | "Khác") => void;
  setFavorites: (favorites: string[]) => void;
  setAvatarUrl: (avatar_url: string) => void;
  setBio: (bio: string) => void;
  setUsername: (username: string) => void;
  setMSSV: (mssv: string) => void;
  setCourse: (course: string) => void;
  setMajor: (major: string) => void;
}

export interface CardStudent {
  mssv: string;
  name: string;
  dob: string;
  major: string;
  course: string;
}
