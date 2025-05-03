import { z } from "zod";

export const CreateRoleBody = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  active: z.boolean().default(true),
  permissions: z.array(z.object({ id: z.number() })).optional(), // Array of objects with id
  //   permissions: z.array(z.number()).optional(), // Array of permission IDs
});

export const UpdateRoleBody = CreateRoleBody.partial().extend({
  id: z.number().optional(), // ID is included for updates
});

export type CreateRoleBodyType = z.infer<typeof CreateRoleBody>;
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBody>;

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  permissions: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      apiPath: z.string(),
      method: z.string(),
      module: z.string(),
    })
  ),
});

export const RoleListRes = z.object({
  status: z.number(),
  payload: z.object({
    statusCode: z.number(),
    error: z.string().nullable(),
    message: z.string(),
    data: z.object({
      result: z.array(RoleSchema),
      meta: z.object({
        page: z.number(),
        pageSize: z.number(),
        pages: z.number(),
        total: z.number(),
      }),
    }),
  }),
});

export const RoleRes = z.object({
  status: z.number(),
  payload: z.object({
    statusCode: z.number(),
    error: z.string().nullable(),
    message: z.string(),
    data: RoleSchema,
  }),
});

export type RoleSchemaType = z.infer<typeof RoleSchema>;
export type RoleListResType = z.infer<typeof RoleListRes>;
export type RoleResType = z.infer<typeof RoleRes>;
