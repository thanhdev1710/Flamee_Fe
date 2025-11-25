import { z } from "zod";

export const NotificationTypeEnum = z.enum([
  "like",
  "comment",
  "follow",
  "system",
  "post",
  "share",
]);

export const NotificationSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  type: NotificationTypeEnum,
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean().optional(),
  readAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationType = z.infer<typeof NotificationTypeEnum>;
