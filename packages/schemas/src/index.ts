import { z } from "zod";

export const SignInSchema = z.object({
email: z.string().min(1, { message: "Atleat one char" }),
  password: z.string().min(8, { message: "should be alteat 8 chare" }),
});

export const SignUpSchema = z.object({
  name: z.string().min(1, { message: "Atleat one char" }),
email: z.string().min(1, { message: "Atleat one char" }),
  password: z.string().min(8, { message: "should be alteat 8 chare" }),
});


export const createRoomSchema=z.object({
  slug:z.string().min(1,{message:"slug is required"})
})