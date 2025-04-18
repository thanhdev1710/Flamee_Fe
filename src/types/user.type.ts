import { z } from "zod";

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
