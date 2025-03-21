import { TableStatusValues } from "@/constants/type";
import z from "zod";
///// Train
export const CreateTrainBody = z.object({
  number: z.coerce.number().positive(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional(),
});

export type CreateTableBodyType = z.TypeOf<typeof CreateTrainBody>;

export const TrainSchema = z.object({
  name: z.string(),
  route: z.string(),
  status: z.enum(TableStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
  id: z.number(),
});

export const TrainRes = z.object({
  data: TrainSchema,
  message: z.string(),
});

export type TrainResType = z.TypeOf<typeof TrainRes>;

export const TrainListRes = z.object({
  data: z.array(TrainSchema),
  message: z.string(),
});

export type TrainListResType = z.TypeOf<typeof TrainListRes>;

export const UpdateTableBody = z.object({
  changeToken: z.boolean(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional(),
});

//////////
export type UpdateTableBodyType = z.TypeOf<typeof UpdateTableBody>;
export const TableParams = z.object({
  number: z.coerce.number(),
});
export type TableParamsType = z.TypeOf<typeof TableParams>;
