import z from "zod";

export const RegisterBody = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    fullName: z.string().min(1, "Full name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterBodyType = z.infer<typeof RegisterBody>;
export const LoginBody = z
  .object({
    username: z.string().min(1, { message: "required" }).email({
      message: "invalidEmail",
    }),
    password: z.string().min(6, { message: "invalidPassword" }).max(100),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  statusCode: z.number(),
  error: z.string().nullable(),
  message: z.string(),
  data: z.object({
    access_token: z.string(),
    user: z.object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      role: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        active: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string().nullable(),
        createdBy: z.string(),
        updatedBy: z.string().nullable(),
        permissions: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            apiPath: z.string(),
            method: z.string(),
            module: z.string(),
            createdAt: z.string(),
            updatedAt: z.string().nullable(),
            createdBy: z.string(),
            updatedBy: z.string().nullable(),
          })
        ),
      }),
    }),
  }),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>;

export const RefreshTokenRes = z.object({
  statusCode: z.number(),
  error: z.string().nullable(),
  message: z.string(),
  data: z.object({
    access_token: z.string(),
    user: z.object({
      id: z.number(),
      email: z.string(),
      name: z.string(),
      role: z.object({
        id: z.number(),
        name: z.string(),
      }),
    }),
  }),
});

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>;

export const LogoutBody = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>;

export const VerifyCodeBody = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Verification code must be 6 characters"),
});

export const VerifyEmailBody = z.object({
  email: z.string().email("Invalid email address"),
});

export type VerifyCodeBodyType = z.infer<typeof VerifyCodeBody>;
export type VerifyEmailBodyType = z.infer<typeof VerifyEmailBody>;
export interface RegisterResType {
  userId: number;
  email: string;
  fullName: string;
  citizenId: string | null;
  phoneNumber: string | null;
  avatar: string | null;
  createdAt: string;
  codeExpired: string;
}
export const ResetPasswordBody = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .nonempty("Email is required"),
    verificationCode: z
      .string()
      .nonempty("Verification code is required")
      .min(6, "Verification code must be at least 6 characters"),
    newPassword: z
      .string()
      .nonempty("New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;
