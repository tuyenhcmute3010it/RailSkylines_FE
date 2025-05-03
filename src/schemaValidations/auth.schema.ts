// import { Role } from "@/constants/type";
// import z from "zod";

// export const LoginBody = z
//   .object({
//     email: z.string().min(1, { message: "required" }).email({
//       message: "invalidEmail",
//     }),
//     password: z.string().min(6, { message: "invalidPassword" }).max(100),
//   })
//   .strict();

// export type LoginBodyType = z.TypeOf<typeof LoginBody>;

// export const LoginRes = z.object({
//   data: z.object({
//     accessToken: z.string(),
//     refreshToken: z.string(),
//     account: z.object({
//       id: z.number(),
//       name: z.string(),
//       email: z.string(),
//       // role: z.enum([Role.Owner, Role.Employee]),
//     }),
//   }),
//   message: z.string(),
// });

// export type LoginResType = z.TypeOf<typeof LoginRes>;

// export const RefreshTokenBody = z
//   .object({
//     refreshToken: z.string(),
//   })
//   .strict();

// export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>;

// export const RefreshTokenRes = z.object({
//   data: z.object({
//     accessToken: z.string(),
//     refreshToken: z.string(),
//   }),
//   message: z.string(),
// });

// export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>;

// export const LogoutBody = z
//   .object({
//     refreshToken: z.string(),
//   })
//   .strict();

// export type LogoutBodyType = z.TypeOf<typeof LogoutBody>;

import z from "zod";

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
