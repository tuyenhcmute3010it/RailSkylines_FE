import { TableStatusValues, TrainStatusValues } from "@/constants/type";
import z from "zod";
///// Train

export const CreateTrainBody = z.object({
  trainName: z.string().min(1).max(256),
  trainStatus: z.enum(TrainStatusValues).optional(),
});

export type CreateTrainBodyType = z.TypeOf<typeof CreateTrainBody>;

export const TrainSchema = z.object({
  trainId: z.number(),
  trainName: z.string(),
  trainStatus: z.enum(TrainStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TrainRes = z.object({
  data: TrainSchema,
  message: z.string(),
});

export type TrainResType = z.TypeOf<typeof TrainRes>;

export const TrainListRes = z.object({
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
    result: z.array(TrainSchema),
  }),
});
export type TrainListResType = z.TypeOf<typeof TrainListRes>;

export const UpdateTrainBody = CreateTrainBody;
export type UpdateTrainBodyType = CreateTrainBodyType;
export const TrainParams = z.object({
  id: z.coerce.number(),
});
export type TrainParamsType = z.TypeOf<typeof TrainParams>;
