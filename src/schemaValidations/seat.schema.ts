import { z } from "zod";
import { CarriageSchema } from "./carriage.schema"; // Reuse CarriageSchema from provided code
import { SeatStatus, SeatStatusValues, SeatTypeValues } from "@/constants/type";

// Minimal schema for Ticket (for the OneToOne relationship)
export const TicketSummarySchema = z.object({
  ticketId: z.number(),
  // Add other relevant fields if needed (e.g., passengerName, status)
});
export type TicketSummarySchemaType = z.TypeOf<typeof TicketSummarySchema>;

// Schema for creating a seat
export const CreateSeatBody = z.object({
  carriage: CarriageSchema, // Reference to Carriage
  seatStatus: z.enum(SeatStatusValues).optional(), // Default to AVAILABLE
  price: z.number().min(0, "Price must be non-negative"),
  seatType: z.enum(SeatTypeValues).optional(), // Optional seat type
  ticket: TicketSummarySchema.optional(), // Optional ticket (may not be assigned)
});
export type CreateSeatBodyType = z.TypeOf<typeof CreateSeatBody>;

// Schema for a single seat
export const SeatSchema = z.object({
  seatId: z.number(),
  seatStatus: z.enum(SeatStatusValues),
  price: z.number(),
  ticket: TicketSummarySchema.nullable(), // Ticket can be null if not assigned
  carriage: CarriageSchema.nullable(),
  seatType: z.enum(SeatTypeValues),
});
export type SeatSchemaType = z.TypeOf<typeof SeatSchema>;

// Schema for single seat response
export const SeatRes = z.object({
  data: SeatSchema,
  message: z.string(),
});
export type SeatResType = z.TypeOf<typeof SeatRes>;

// Schema for seat list response
export const SeatListRes = z.object({
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
    result: z.array(SeatSchema),
  }),
});

export type SeatListResType = z.TypeOf<typeof SeatListRes>;

// Schema for updating a seat (same as create)
export const UpdateSeatBody = CreateSeatBody;
export type UpdateSeatBodyType = CreateSeatBodyType;

// Schema for seat parameters (e.g., ID in URL)
export const SeatParams = z.object({
  id: z.coerce.number(),
});
export type SeatParamsType = z.TypeOf<typeof SeatParams>;
