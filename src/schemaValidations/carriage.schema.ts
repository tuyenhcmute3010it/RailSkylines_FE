import { CarriageTypesValues } from "@/constants/type";
import { z } from "zod";
import { TrainSchema, TrainSummarySchema } from "./train.schema";

// Define carriage type enum

// Schema for creating a carriage
export const CreateCarriageBody = z.object({
  train: TrainSummarySchema,
  carriageType: z.enum(CarriageTypesValues).optional(),
  price: z.number().min(0, "Min is 0"),
  discount: z.number().min(0, "Min is 0%").max(100, "Max is 100%"),
});
export type CreateCarriageBodyType = z.TypeOf<typeof CreateCarriageBody>;

// Schema for a single carriage
export const CarriageSchema = z.object({
  carriageId: z.number(),
  train: TrainSummarySchema,
  price: z.number(),
  discount: z.number(),
  carriageType: z.enum(CarriageTypesValues),
});

export type CarriageSchemaType = z.TypeOf<typeof CarriageSchema>;

// Schema for single carriage response
export const CarriageRes = z.object({
  data: CarriageSchema,
  message: z.string(),
});

export type CarriageResType = z.TypeOf<typeof CarriageRes>;

// Schema for carriage list response
export const CarriageListRes = z.object({
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
    result: z.array(CarriageSchema),
  }),
});

export type CarriageListResType = z.TypeOf<typeof CarriageListRes>;

// Schema for updating a carriage (same as create)
export const UpdateCarriageBody = CreateCarriageBody;
export type UpdateCarriageBodyType = CreateCarriageBodyType;

// Schema for carriage parameters (e.g., ID in URL)
export const CarriageParams = z.object({
  id: z.coerce.number(),
});

export type CarriageParamsType = z.TypeOf<typeof CarriageParams>;
