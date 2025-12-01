import { z } from 'zod';

export const registerUserSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters long").max(64, "Username must be at most 64 characters long"),

        email: z.email("Invalid email address format"),

        password: z.string().min(8, "Password must be at least 8 characters long"),



    })
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>['body'];




export const loginUserSchema = z.object({
  body: z.object({

    email: z.email("Invalid email address format"),

    password: z.string().min(1, "Password is required"), // At least it shouldn't be empty(I did the rest in the register schema)

  }),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];