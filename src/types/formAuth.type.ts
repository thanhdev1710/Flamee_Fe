import { z } from "zod";

// Schema chung
export const authSchema = z
  .object({
    type: z.enum(["signin", "signup", "send-reset-password", "reset-password"]),
    email: z.string().optional(),
    password: z.string().optional(),
    rememberMe: z.boolean().optional(),
    confirmPassword: z.string().optional(),
    confirmPolicy: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const { type, email, password, confirmPassword, confirmPolicy } = data;

    // 🎯 Các loại cần email
    if (["signin", "signup", "send-reset-password"].includes(type)) {
      if (!email || email.trim() === "") {
        ctx.addIssue({
          path: ["email"],
          message: "Vui lòng nhập email",
          code: z.ZodIssueCode.custom,
        });
      } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          ctx.addIssue({
            path: ["email"],
            message: "Email không hợp lệ",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }

    // 🎯 Các loại cần password
    if (["signin", "signup", "reset-password"].includes(type)) {
      if (!password) {
        ctx.addIssue({
          path: ["password"],
          message: "Vui lòng nhập mật khẩu",
          code: z.ZodIssueCode.custom,
        });
      } else {
        if (password.length < 13) {
          ctx.addIssue({
            path: ["password"],
            message: "Mật khẩu phải chứa ít nhất 13 ký tự",
            code: z.ZodIssueCode.custom,
          });
        }
        if (!/[a-z]/.test(password))
          ctx.addIssue({
            path: ["password"],
            message: "Mật khẩu phải chứa ít nhất 1 chữ thường",
            code: z.ZodIssueCode.custom,
          });
        if (!/[A-Z]/.test(password))
          ctx.addIssue({
            path: ["password"],
            message: "Mật khẩu phải chứa ít nhất 1 chữ hoa",
            code: z.ZodIssueCode.custom,
          });
        if (!/[0-9]/.test(password))
          ctx.addIssue({
            path: ["password"],
            message: "Mật khẩu phải chứa ít nhất 1 số",
            code: z.ZodIssueCode.custom,
          });
        if (!/[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
          ctx.addIssue({
            path: ["password"],
            message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
            code: z.ZodIssueCode.custom,
          });
      }
    }

    // 🎯 Signup cần xác nhận mật khẩu và chính sách
    if (type === "signup") {
      if (!confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Vui lòng nhập xác nhận mật khẩu",
          code: z.ZodIssueCode.custom,
        });
      } else if (password !== confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Mật khẩu xác nhận không khớp",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!confirmPolicy) {
        ctx.addIssue({
          path: ["confirmPolicy"],
          message: "Bạn phải đồng ý với điều khoản",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // 🎯 reset-password cũng cần xác nhận mật khẩu
    if (type === "reset-password") {
      if (!confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Vui lòng nhập xác nhận mật khẩu",
          code: z.ZodIssueCode.custom,
        });
      } else if (password !== confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: "Mật khẩu xác nhận không khớp",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type AuthFormData = z.infer<typeof authSchema>;

export type FormType =
  | "signin"
  | "signup"
  | "send-reset-password"
  | "reset-password";

export const checkPasswordStrength = (password: string) => {
  let strength = 0;
  const role: string[] = [];

  // Kiểm tra chiều dài mật khẩu
  if (password.length >= 13) {
    role.push("length");
    strength++;
  }

  // Kiểm tra chữ thường
  if (/[a-z]/.test(password)) {
    role.push("lowercase");
    strength++;
  }

  // Kiểm tra chữ hoa
  if (/[A-Z]/.test(password)) {
    role.push("uppercase");
    strength++;
  }

  // Kiểm tra số
  if (/[0-9]/.test(password)) {
    role.push("number");
    strength++;
  }

  // Kiểm tra ký tự đặc biệt
  if (/[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    role.push("special");
    strength++;
  }

  return { strength, role };
};
