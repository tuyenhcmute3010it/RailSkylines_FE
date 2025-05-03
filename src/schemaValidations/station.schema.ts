import { z } from "zod";

// Schema for a single station
export const StationSchema = z.object({
  stationId: z.number(),
  stationName: z.string().min(1, "Station name is required"),
  position: z.number().min(0, "Position must be non-negative"),
});

export type StationSchemaType = z.TypeOf<typeof StationSchema>;

// Schema for creating a station
export const CreateStationBody = z.object({
  stationName: z.string().min(1, "Station name is required"),
  position: z.number().min(0, "Position must be non-negative"),
});

export type CreateStationBodyType = z.TypeOf<typeof CreateStationBody>;

// Schema for updating a station (same as create)
export const UpdateStationBody = CreateStationBody;
export type UpdateStationBodyType = CreateStationBodyType;

// Schema for single station response
export const StationRes = z.object({
  data: StationSchema,
  message: z.string(),
});

export type StationResType = z.TypeOf<typeof StationRes>;

// Schema for station list response
export const StationListRes = z.object({
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
    result: z.array(StationSchema),
  }),
});

export type StationListResType = z.TypeOf<typeof StationListRes>;

// Schema for station parameters (e.g., ID in URL)
export const StationParams = z.object({
  id: z.coerce.number(),
});

export type StationParamsType = z.TypeOf<typeof StationParams>;
