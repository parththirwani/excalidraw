import { z } from "zod"

export const CreateUserSchema = z.object({
    email: z.string().min(3),
    password:z.string(),
    name:z.string()
})

export const SignSchema = z.object({
    email: z.string().min(3),
    password: z.string()
})

export const CreateRoomSchema = z.object({
    name:z.string().min(3).max(20)
})