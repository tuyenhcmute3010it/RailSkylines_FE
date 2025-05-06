// // import { z } from "zod";

// // export const PROMOTION_STATUSES = ["active", "inactive", "expired"] as const;

// // // Schema for creating a promotion
// // export const CreatePromotionBody = z.object({
// //   promotionCode: z.string().min(1, "Promotion Code is required"),
// //   promotionDescription: z.string().min(1, "Promotion Description is required"),
// //   promotionName: z.string().min(1, "Promotion Name is required"),
// //   discount: z.number().min(0, "Discount must be non-negative"),
// //   startDate: z.string().datetime({ message: "Invalid start date format" }),
// //   validity: z.string().datetime({ message: "Invalid validity date format" }),
// //   status: z.enum(PROMOTION_STATUSES, { message: "Invalid status" }),
// // });

// // export type CreatePromotionBodyType = z.TypeOf<typeof CreatePromotionBody>;

// // // Schema for a single promotion
// // export const PromotionSchema = z.object({
// //   id: z.number(),
// //   promotionCode: z.string(),
// //   promotionDescription: z.string(),
// //   promotionName: z.string(),
// //   discount: z.number(),
// //   startDate: z.string().datetime(),
// //   validity: z.string().datetime(),
// //   status: z.enum(PROMOTION_STATUSES),
// //   createdAt: z.string().optional(),
// //   updatedAt: z.string().optional(),
// //   createdBy: z.string().optional(),
// //   updatedBy: z.string().optional(),
// // });

// // export type PromotionSchemaType = z.TypeOf<typeof PromotionSchema>;

// // // Schema for single promotion response
// // export const PromotionRes = z.object({
// //   status: z.number(),
// //   statusCode: z.number(),
// //   error: z.string().nullable(),
// //   message: z.string(),
// //   data: PromotionSchema,
// // });

// // export type PromotionResType = z.TypeOf<typeof PromotionRes>;

// // // Schema for promotion list response
// // export const PromotionListRes = z.object({
// //   statusCode: z.number(),
// //   error: z.string().nullable(),
// //   message: z.string(),
// //   data: z.object({
// //     meta: z.object({
// //       page: z.number(),
// //       pageSize: z.number(),
// //       pages: z.number(),
// //       total: z.number(),
// //     }),
// //     result: z.array(PromotionSchema),
// //   }),
// // });

// // export type PromotionListResType = z.TypeOf<typeof PromotionListRes>;

// // // Schema for updating a promotion (same as create)
// // export const UpdatePromotionBody = CreatePromotionBody;

// // export type UpdatePromotionBodyType = z.TypeOf<typeof UpdatePromotionBody>;

// // // Schema for promotion parameters (e.g., ID in URL)
// // export const PromotionParams = z.object({
// //   id: z.coerce.number(),
// // });

// // export type PromotionParamsType = z.TypeOf<typeof PromotionParams>;

// import { z } from "zod";

// export const PROMOTION_STATUSES = ["active", "inactive", "expired"] as const;

// // Schema for creating a promotion
// export const CreatePromotionBody = z
//   .object({
//     promotionCode: z.string().min(1, "Promotion Code is required"),
//     promotionDescription: z
//       .string()
//       .min(1, "Promotion Description is required"),
//     promotionName: z.string().min(1, "Promotion Name is required"),
//     discount: z.number().min(0, "Discount must be non-negative"),
//     startDate: z
//       .string()
//       .min(1, "Start date is required")
//       .transform((val) => new Date(val).toISOString())
//       .refine((val) => !isNaN(new Date(val).getTime()), {
//         message: "Invalid start date format",
//       }),
//     validity: z
//       .string()
//       .min(1, "Validity date is required")
//       .transform((val) => new Date(val).toISOString())
//       .refine((val) => !isNaN(new Date(val).getTime()), {
//         message: "Invalid validity date format",
//       }),
//     status: z.enum(PROMOTION_STATUSES, { message: "Invalid status" }),
//   })
//   .refine((data) => new Date(data.startDate) <= new Date(data.validity), {
//     message: "Start date cannot be after validity date",
//     path: ["startDate"],
//   });

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

// src/schemaValidations/promotion.schema.ts
import { z } from "zod";

export const PROMOTION_STATUS_ENUM = ["active", "inactive", "expired"] as const;

// Schema for creating a promotion
// Based on ReqPromotionDTO, promotionId is usually generated by BE
// Status might be determined by BE based on dates, or can be explicitly set.
export const CreatePromotionBody = z.object({
  promotionCode: z.string().min(1, "Promotion code is required"),
  promotionDescription: z.string().optional(),
  promotionName: z.string().min(1, "Promotion name is required"),
  discount: z.number().min(0, "Discount must be non-negative"),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      // Assuming ISO string from date picker
      message: "Invalid start date",
    })
    .optional(), // BE defaults to Instant.now() if null
  validity: z.string().refine((val) => !isNaN(Date.parse(val)), {
    // Assuming ISO string
    message: "Invalid validity date",
  }),
  status: z.enum(PROMOTION_STATUS_ENUM).optional(), // Status can be auto-calculated or set
});

export type CreatePromotionBodyType = z.TypeOf<typeof CreatePromotionBody>;

// Schema for a single promotion (aligns with ReqPromotionDTO from BE)
export const PromotionSchema = z.object({
  promotionId: z.number(),
  promotionCode: z.string(),
  promotionDescription: z.string().nullable().optional(),
  promotionName: z.string(),
  discount: z.number(),
  startDate: z.string(), // Instant from BE, usually represented as ISO string
  validity: z.string(), // Instant from BE
  status: z.enum(PROMOTION_STATUS_ENUM),
});

export type PromotionSchemaType = z.TypeOf<typeof PromotionSchema>;

// Schema for single promotion response (BE returns ReqPromotionDTO directly)
// Assuming a wrapper similar to PermissionRes for consistency if your http client adds it
// If http.get<ReqPromotionDTO> is used directly, this wrapper isn't strictly from BE for single GET
// but for mutations, the BE returns ReqPromotionDTO directly.
// For now, let's assume mutations return the raw DTO and list wraps it.
export const PromotionRes = z.object({
  // This structure depends on how your `http` client wraps responses.
  // If it's like the permission example where successful responses have a 'payload' or 'data'.
  // The provided BE controller returns ResponseEntity<ReqPromotionDTO> directly.
  // Let's assume your http client provides the data directly for single items.
  // For consistency with the provided permission example, we can assume a light wrapper or direct data.
  // Let's use a structure that can be adapted.
  // If your http.post/put returns the data directly (ReqPromotionDTO), this specific Res type might only be for GET by ID
  // or you might make your http client always return a consistent structure.

  // For a GET by ID which returns ResponseEntity<ReqPromotionDTO>, the actual data is ReqPromotionDTO.
  // Let's assume the `data` field holds the ReqPromotionDTO.
  data: PromotionSchema, // For single promotion
  message: z.string().optional(), // Optional message
  // Add other fields like status, statusCode, error if your http client standardizes this
});
export type PromotionResType = z.TypeOf<typeof PromotionRes>; // More accurately ReqPromotionDTO

// Schema for promotion list response (matches ResultPaginationDTO from BE)
export const PromotionListRes = z.object({
  // statusCode: z.number(), // These were in PermissionListRes, adapt if your BE sends them
  // error: z.string().nullable(),
  // message: z.string(),
  meta: z.object({
    page: z.number(),
    pageSize: z.number(),
    pages: z.number(),
    total: z.number(),
  }),
  result: z.array(PromotionSchema), // In BE, this is 'result' field holding List<ReqPromotionDTO>
});

export type PromotionListResType = z.TypeOf<typeof PromotionListRes>;

// Schema for updating a promotion
// It's similar to CreatePromotionBody but promotionId is handled in the URL/mutation params.
export const UpdatePromotionBody = CreatePromotionBody.extend({
  // No need to redefine fields if they are the same.
  // `status` can be part of the general update.
});
export type UpdatePromotionBodyType = z.TypeOf<typeof UpdatePromotionBody>;

// Schema for updating promotion status specifically
export const UpdatePromotionStatusBody = z.object({
  status: z.enum(PROMOTION_STATUS_ENUM),
});
export type UpdatePromotionStatusBodyType = z.TypeOf<
  typeof UpdatePromotionStatusBody
>;

// Schema for promotion parameters (e.g., ID in URL)
export const PromotionParams = z.object({
  id: z.coerce.number(),
});
export type PromotionParamsType = z.TypeOf<typeof PromotionParams>;
