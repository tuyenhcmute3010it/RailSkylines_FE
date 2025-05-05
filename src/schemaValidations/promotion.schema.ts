// import { z } from "zod";

// export const PROMOTION_STATUSES = ["active", "inactive", "expired"] as const;

// // Schema for creating a promotion
// export const CreatePromotionBody = z.object({
//   promotionCode: z.string().min(1, "Promotion Code is required"),
//   promotionDescription: z.string().min(1, "Promotion Description is required"),
//   promotionName: z.string().min(1, "Promotion Name is required"),
//   discount: z.number().min(0, "Discount must be non-negative"),
//   startDate: z.string().datetime({ message: "Invalid start date format" }),
//   validity: z.string().datetime({ message: "Invalid validity date format" }),
//   status: z.enum(PROMOTION_STATUSES, { message: "Invalid status" }),
// });

// export type CreatePromotionBodyType = z.TypeOf<typeof CreatePromotionBody>;

// // Schema for a single promotion
// export const PromotionSchema = z.object({
//   id: z.number(),
//   promotionCode: z.string(),
//   promotionDescription: z.string(),
//   promotionName: z.string(),
//   discount: z.number(),
//   startDate: z.string().datetime(),
//   validity: z.string().datetime(),
//   status: z.enum(PROMOTION_STATUSES),
//   createdAt: z.string().optional(),
//   updatedAt: z.string().optional(),
//   createdBy: z.string().optional(),
//   updatedBy: z.string().optional(),
// });

// export type PromotionSchemaType = z.TypeOf<typeof PromotionSchema>;

// // Schema for single promotion response
// export const PromotionRes = z.object({
//   status: z.number(),
//   statusCode: z.number(),
//   error: z.string().nullable(),
//   message: z.string(),
//   data: PromotionSchema,
// });

// export type PromotionResType = z.TypeOf<typeof PromotionRes>;

// // Schema for promotion list response
// export const PromotionListRes = z.object({
//   statusCode: z.number(),
//   error: z.string().nullable(),
//   message: z.string(),
//   data: z.object({
//     meta: z.object({
//       page: z.number(),
//       pageSize: z.number(),
//       pages: z.number(),
//       total: z.number(),
//     }),
//     result: z.array(PromotionSchema),
//   }),
// });

// export type PromotionListResType = z.TypeOf<typeof PromotionListRes>;

// // Schema for updating a promotion (same as create)
// export const UpdatePromotionBody = CreatePromotionBody;

// export type UpdatePromotionBodyType = z.TypeOf<typeof UpdatePromotionBody>;

// // Schema for promotion parameters (e.g., ID in URL)
// export const PromotionParams = z.object({
//   id: z.coerce.number(),
// });

// export type PromotionParamsType = z.TypeOf<typeof PromotionParams>;

import { z } from "zod";

export const PROMOTION_STATUSES = ["active", "inactive", "expired"] as const;

// Schema for creating a promotion
export const CreatePromotionBody = z
  .object({
    promotionCode: z.string().min(1, "Promotion Code is required"),
    promotionDescription: z
      .string()
      .min(1, "Promotion Description is required"),
    promotionName: z.string().min(1, "Promotion Name is required"),
    discount: z.number().min(0, "Discount must be non-negative"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .transform((val) => new Date(val).toISOString())
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid start date format",
      }),
    validity: z
      .string()
      .min(1, "Validity date is required")
      .transform((val) => new Date(val).toISOString())
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid validity date format",
      }),
    status: z.enum(PROMOTION_STATUSES, { message: "Invalid status" }),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.validity), {
    message: "Start date cannot be after validity date",
    path: ["startDate"],
  });

export type CreatePromotionBodyType = z.TypeOf<typeof CreatePromotionBody>;

// Schema for a single promotion
export const PromotionSchema = z.object({
  id: z.number(),
  promotionCode: z.string(),
  promotionDescription: z.string(),
  promotionName: z.string(),
  discount: z.number(),
  startDate: z.string().datetime(),
  validity: z.string().datetime(),
  status: z.enum(PROMOTION_STATUSES),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type PromotionSchemaType = z.TypeOf<typeof PromotionSchema>;

// Schema for single promotion response
export const PromotionRes = z.object({
  status: z.number(),
  statusCode: z.number(),
  error: z.string().nullable(),
  message: z.string(),
  data: PromotionSchema,
});

export type PromotionResType = z.TypeOf<typeof PromotionRes>;

// Schema for promotion list response
export const PromotionListRes = z.object({
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
    result: z.array(PromotionSchema),
  }),
});

export type PromotionListResType = z.TypeOf<typeof PromotionListRes>;

// Schema for updating a promotion (same as create)
export const UpdatePromotionBody = CreatePromotionBody;

export type UpdatePromotionBodyType = z.TypeOf<typeof UpdatePromotionBody>;

// Schema for promotion parameters (e.g., ID in URL)
export const PromotionParams = z.object({
  id: z.coerce.number(),
});

export type PromotionParamsType = z.TypeOf<typeof PromotionParams>;
