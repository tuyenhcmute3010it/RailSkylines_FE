// src/schemaValidations/permission.schema.ts
import { z } from "zod";

export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

// Schema for creating a permission
export const CreatePermissionBody = z.object({
  name: z.string().min(1, "Name is required"),
  apiPath: z.string().min(1, "API Path is required"),
  method: z.enum(HTTP_METHODS, { message: "Invalid HTTP method" }),
  module: z.string().min(1, "Module is required"),
});

export type CreatePermissionBodyType = z.TypeOf<typeof CreatePermissionBody>;

// Schema for a single permission
export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  apiPath: z.string(),
  method: z.enum(HTTP_METHODS),
  module: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type PermissionSchemaType = z.TypeOf<typeof PermissionSchema>;

// Schema for single permission response
export const PermissionRes = z.object({
  status: z.number(),
  payload: z.object({
    statusCode: z.number(),
    error: z.string().nullable(),
    message: z.string(),
    data: PermissionSchema,
  }),
});

export type PermissionResType = z.TypeOf<typeof PermissionRes>;

// Schema for permission list response
export const PermissionListRes = z.object({
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
    result: z.array(PermissionSchema),
  }),
});

export type PermissionListResType = z.TypeOf<typeof PermissionListRes>;

// Schema for updating a permission (same as create)
export const UpdatePermissionBody = CreatePermissionBody;

export type UpdatePermissionBodyType = z.TypeOf<typeof UpdatePermissionBody>;

// Schema for permission parameters (e.g., ID in URL)
export const PermissionParams = z.object({
  id: z.coerce.number(),
});

export type PermissionParamsType = z.TypeOf<typeof PermissionParams>;
