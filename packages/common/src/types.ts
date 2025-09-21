import { z } from "zod"

export const CreateUserSchema = z.object({
  email: z.string()
    .min(3, "Email must be at least 3 characters")
    .max(100, "Email must be less than 100 characters")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, apostrophes, and hyphens")
    .trim()
})

export const SignSchema = z.object({
  email: z.string()
    .min(5, "Email must be at least 5 characters")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, "Password is required")
})

export const RoomTypeEnum = z.enum(["PUBLIC", "PRIVATE"])

export const CreateRoomSchema = z.object({
  name: z.string()
    .min(3, "Room name must be at least 3 characters")
    .max(30, "Room name must be less than 30 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Room name can only contain letters, numbers, spaces, hyphens, and underscores")
    .trim(),
  type: RoomTypeEnum.default("PUBLIC")
})

