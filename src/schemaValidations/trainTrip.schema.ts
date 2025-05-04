import { z } from "zod";

export const TrainTripSchema = z.object({
  trainTripId: z.number(),
  train: z.object({
    trainId: z.number(),
    trainName: z.string(),
    trainStatus: z.string(),
  }),
  route: z.object({
    routeId: z.number(),
    originStation: z.object({
      stationId: z.number(),
      stationName: z.string(),
      position: z.number(),
    }),
    journey: z.array(
      z.object({
        stationId: z.number(),
        stationName: z.string(),
        position: z.number(),
      })
    ),
  }),
  schedule: z.object({
    scheduleId: z.number(),
    departure: z.object({
      clockTimeId: z.number(),
      date: z.string().datetime(),
      hour: z.number(),
      minute: z.number(),
    }),
    arrival: z.object({
      clockTimeId: z.number(),
      date: z.string().datetime(),
      hour: z.number(),
      minute: z.number(),
    }),
  }),
});

export type TrainTripSchemaType = z.TypeOf<typeof TrainTripSchema>;
// export type CreateTrainTripBodyType = z.TypeOf<typeof CreateTrainTripBody>;
export const CreateTrainTripBody = z.object({
  trainId: z.number().min(1, "Train ID is required"),
  originStationName: z.string().min(1, "Origin station is required"),
  journeyStationNames: z
    .array(z.string().min(1))
    .min(1, "At least one journey station is required"),
  departureTime: z
    .string()
    .transform((val) => (val ? new Date(val).toISOString() : ""))
    .refine((val) => val !== "", { message: "Departure time is required" }),
  arrivalTime: z
    .string()
    .transform((val) => (val ? new Date(val).toISOString() : ""))
    .refine((val) => val !== "", { message: "Arrival time is required" }),
});

export type CreateTrainTripBodyType = z.TypeOf<typeof CreateTrainTripBody>;

export const UpdateTrainTripBody = CreateTrainTripBody;
export type UpdateTrainTripBodyType = CreateTrainTripBodyType;

export const TrainTripRes = z.object({
  statusCode: z.number(),
  error: z.string().nullable(),
  message: z.string(),
  data: TrainTripSchema,
});

export type TrainTripResType = z.TypeOf<typeof TrainTripRes>;

export const TrainTripListRes = z.object({
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
    result: z.array(TrainTripSchema),
  }),
});

export type TrainTripListResType = z.TypeOf<typeof TrainTripListRes>;
