import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .nonempty("Email không được để trống")
    .email("Email không hợp lệ"),

  password: z
    .string()
    .nonempty("Mật khẩu không được để trống")
    .min(13, "Mật khẩu không đúng định dạng")
    .refine((val) => /[a-z]/.test(val), {
      message: "Mật khẩu không đúng định dạng",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Mật khẩu không đúng định dạng",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Mật khẩu không đúng định dạng",
    })
    .refine((val) => /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
      message: "Mật khẩu không đúng định dạng",
    }),

  rememberMe: z.boolean(),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email không được để trống")
      .email("Email không hợp lệ"),

    password: z
      .string()
      .nonempty("Mật khẩu không được để trống")
      .min(13, "Mật khẩu phải có ít nhất 13 ký tự")
      .refine((val) => /[a-z]/.test(val), {
        message: "Mật khẩu phải chứa ít nhất 1 chữ thường",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Mật khẩu phải chứa ít nhất 1 chữ hoa",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Mật khẩu phải chứa ít nhất 1 số",
      })
      .refine(
        (val) => /[!@#\$%\^&\*\(\)_\+\-=\[\]{};':"\\|,.<>\/?]/.test(val),
        {
          message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
        }
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const createUserSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(50, "Username tối đa 50 ký tự")
    .regex(
      /^(?!.*[_.]{2})(?![_.])[a-zA-Z0-9._]+(?<![_.])$/,
      "Username chỉ được chứa chữ cái, số, dấu _ và ., không được bắt đầu/kết thúc bằng _ hoặc ., và không có dấu liên tiếp"
    ),
  fullname: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(50, "Username tối đa 50 ký tự"),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;
