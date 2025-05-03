import { z } from "zod";
import { RoleSchema } from "./role.schema";

// Schema for a single account
export const AccountSchema = z.object({
  userId: z.number(),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Name is required"),
  avatar: z.string().url("Invalid URL").optional(),
  phoneNumber: z.string().optional(),
  citizenId: z.string().optional(),
  // role: z.string().optional(),
  role: RoleSchema,
});

export type AccountType = z.TypeOf<typeof AccountSchema>;

// Schema for creating an account
export const CreateEmployeeAccountBody = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
    fullName: z.string().min(1, "Name is required"),
    avatar: z.string().url("Invalid URL").optional(),
    phoneNumber: z.string().optional(),
    citizenId: z.string().optional(),
    // role: z.string().optional(),
    role: RoleSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateEmployeeAccountBodyType = z.TypeOf<
  typeof CreateEmployeeAccountBody
>;

// Schema for updating an account
export const UpdateEmployeeAccountBody = z
  .object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(1, "Name is required"),
    avatar: z.string().url("Invalid URL").optional(),
    phoneNumber: z.string().optional(),
    citizenId: z.string().optional(),
    role: RoleSchema,
    changePassword: z.boolean(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters")
      .optional(),
  })
  .refine(
    (data) =>
      !data.changePassword ||
      (data.password && data.password === data.confirmPassword),
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type UpdateEmployeeAccountBodyType = z.TypeOf<
  typeof UpdateEmployeeAccountBody
>;

// Schema for single account response
export const AccountRes = z.object({
  data: AccountSchema,
  message: z.string(),
});

export type AccountResType = z.TypeOf<typeof AccountRes>;

// Schema for account list response
export const AccountListRes = z.object({
  statusCode: z.number(),
  error: z.string().nullable(),
  message: z.string(),
  data: z.object({
    meta: z.object({
      page: z.number(),
      pageSize: z.number(),
      pages: z.number(),
      total: z.number(),
    }),
    result: z.array(AccountSchema),
  }),
});

export type AccountListResType = z.TypeOf<typeof AccountListRes>;

// Schema for account parameters (e.g., ID in URL)
export const AccountParams = z.object({
  id: z.coerce.number(),
});

export type AccountParamsType = z.TypeOf<typeof AccountParams>;
