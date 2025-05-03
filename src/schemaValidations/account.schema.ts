// import { Role } from "@/constants/type";
// import z from "zod";

// export const AccountSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   email: z.string(),
//   role: z.enum([Role.Admin, Role.Staff, Role.Customer, Role.Guest]),
//   avatar: z.string().nullable(),
// });

// export type AccountType = z.TypeOf<typeof AccountSchema>;

// export const AccountListRes = z.object({
//   data: z.array(AccountSchema),
//   message: z.string(),
// });

// export type AccountListResType = z.TypeOf<typeof AccountListRes>;

// export const AccountRes = z
//   .object({
//     data: AccountSchema,
//     message: z.string(),
//   })
//   .strict();

// export type AccountResType = z.TypeOf<typeof AccountRes>;

// export const CreateEmployeeAccountBody = z
//   .object({
//     name: z.string().trim().min(2).max(256),
//     email: z.string().email(),
//     avatar: z.string().url().optional(),
//     password: z.string().min(6).max(100),
//     confirmPassword: z.string().min(6).max(100),
//   })
//   .strict()
//   .superRefine(({ confirmPassword, password }, ctx) => {
//     if (confirmPassword !== password) {
//       ctx.addIssue({
//         code: "custom",
//         message: "Mật khẩu không khớp",
//         path: ["confirmPassword"],
//       });
//     }
//   });

// export type CreateEmployeeAccountBodyType = z.TypeOf<
//   typeof CreateEmployeeAccountBody
// >;

// export const UpdateEmployeeAccountBody = z
//   .object({
//     name: z.string().trim().min(2).max(256),
//     email: z.string().email(),
//     avatar: z.string().url().optional(),
//     changePassword: z.boolean().optional(),
//     password: z.string().min(6).max(100).optional(),
//     confirmPassword: z.string().min(6).max(100).optional(),
//     role: z.enum([Role.Admin, Role.Staff]).optional().default(Role.Staff),
//   })
//   .strict()
//   .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
//     if (changePassword) {
//       if (!password || !confirmPassword) {
//         ctx.addIssue({
//           code: "custom",
//           message: "Hãy nhập mật khẩu mới và xác nhận mật khẩu mới",
//           path: ["changePassword"],
//         });
//       } else if (confirmPassword !== password) {
//         ctx.addIssue({
//           code: "custom",
//           message: "Mật khẩu không khớp",
//           path: ["confirmPassword"],
//         });
//       }
//     }
//   });

// export type UpdateEmployeeAccountBodyType = z.TypeOf<
//   typeof UpdateEmployeeAccountBody
// >;

// export const UpdateMeBody = z
//   .object({
//     name: z.string().trim().min(2).max(256),
//     avatar: z.string().url().optional(),
//   })
//   .strict();

// export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;

// export const ChangePasswordBody = z
//   .object({
//     oldPassword: z.string().min(6).max(100),
//     password: z.string().min(6).max(100),
//     confirmPassword: z.string().min(6).max(100),
//   })
//   .strict()
//   .superRefine(({ confirmPassword, password }, ctx) => {
//     if (confirmPassword !== password) {
//       ctx.addIssue({
//         code: "custom",
//         message: "Mật khẩu mới không khớp",
//         path: ["confirmPassword"],
//       });
//     }
//   });

// export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;

// export const AccountIdParam = z.object({
//   id: z.coerce.number(),
// });

// export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>;

// export const GetListGuestsRes = z.object({
//   data: z.array(
//     z.object({
//       id: z.number(),
//       name: z.string(),
//       tableNumber: z.number().nullable(),
//       createdAt: z.date(),
//       updatedAt: z.date(),
//     })
//   ),
//   message: z.string(),
// });

// export type GetListGuestsResType = z.TypeOf<typeof GetListGuestsRes>;

// export const GetGuestListQueryParams = z.object({
//   fromDate: z.coerce.date().optional(),
//   toDate: z.coerce.date().optional(),
// });

// export type GetGuestListQueryParamsType = z.TypeOf<
//   typeof GetGuestListQueryParams
// >;

// export const CreateGuestBody = z
//   .object({
//     name: z.string().trim().min(2).max(256),
//     tableNumber: z.number(),
//   })
//   .strict();

// export type CreateGuestBodyType = z.TypeOf<typeof CreateGuestBody>;

// export const CreateGuestRes = z.object({
//   message: z.string(),
//   data: z.object({
//     id: z.number(),
//     name: z.string(),
//     role: z.enum([Role.Guest]),
//     tableNumber: z.number().nullable(),
//     createdAt: z.date(),
//     updatedAt: z.date(),
//   }),
// });

// export type CreateGuestResType = z.TypeOf<typeof CreateGuestRes>;

import { z } from "zod";

// Schema for a single account
export const AccountSchema = z.object({
  userId: z.number(),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Name is required"),
  avatar: z.string().url("Invalid URL").optional(),
  phoneNumber: z.string().optional(),
  citizenId: z.string().optional(),
  // role: z.string().optional(),
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
    // role: z.string().optional(),
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
