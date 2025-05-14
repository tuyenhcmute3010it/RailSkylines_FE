export interface CreateBookingBodyType {
  trainTripId: number;
  contactEmail: string;
  contactPhone?: string;
  promotionId?: number;
  seatIds: number[]; // Required by backend
  tickets: {
    name: string;
    citizenId: string;
    customerObject: "ADULT" | "CHILD" | "STUDENT";
    boardingStationId: number;
    alightingStationId: number;
    price: number;
  }[];
  paymentType: "VNPAY" | "INTERNATIONAL_CARD" | "DOMESTIC_CARD";
}

export type BookingResType = {
  statusCode: number;
  error: string | null;
  message: string;
  data: string; // VNPay payment URL
};

export type BookingListResType = {
  statusCode: number;
  error: string | null;
  message: string;
  // data: any[];
  data: BookingDetailType[];
};

export interface BookingDetailType {
  bookingId: string;
  transactionId: string;
  contactEmail: string;
  contactPhone?: string;
  totalAmount: number;
  paymentType: string;
  paymentStatus: string;
  bookingDate: string;
  tickets: {
    name: string;
    citizenId: string;
    customerObject: "ADULT" | "CHILD" | "STUDENT";
    trainId: string;
    trainName: string;
    coachName: string;
    seatNumber: number;
    departure: string;
    arrival: string;
    price: number;
  }[];
  promotionIds?: number[];
}
import { z } from "zod";

export const TicketRequestDTOSchema = z.object({
  boardingStationId: z.number(),
  alightingStationId: z.number(),
  customerObject: z
    .enum(["adult", "children", "student", "elderly", "veteran", "disabled"])
    .optional(),
  name: z.string(),
  citizenId: z.string(),
});

export const BookingRequestDTOSchema = z.object({
  trainTripId: z.number(),
  seatIds: z.array(z.number()),
  tickets: z.array(TicketRequestDTOSchema),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  paymentType: z.string(),
  promotionId: z.number().optional(),
  ticketsParam: z.string().optional(),
});

export const ResTicketHistoryDTOSchema = z.object({
  ticketCode: z.string(),
  seatId: z.number(),
  price: z.number(),
  name: z.string(),
  citizenId: z.string(),
  boardingStationName: z.string(),
  alightingStationName: z.string(),
  carriageName: z.string(),
  trainName: z.string(),
  startDay: z.string(),
});

export const ResBookingHistoryDTOSchema = z.object({
  bookingCode: z.string(),
  paymentStatus: z.enum(["pending", "success", "failed"]),
  date: z.string(),
  totalPrice: z.number(),
  contactEmail: z.string().email().nullable(),
  contactPhone: z.string().nullable(),
  paymentType: z.string(),
  tickets: z.array(ResTicketHistoryDTOSchema),
});

export const BookingSchema = z.object({
  bookingId: z.number(),
  bookingCode: z.string(),
  paymentStatus: z.enum(["pending", "success", "failed"]),
  totalPrice: z.number(),
  contactEmail: z.string().email().nullable(),
  contactPhone: z.string().nullable(),
  date: z.string(),
  user: z.object({ email: z.string().email(), name: z.string() }).nullable(),
});

export const TicketSchema = z.object({
  ticketCode: z.string(),
  seat: z.object({ seatId: z.number() }),
  price: z.number(),
  name: z.string(),
  citizenId: z.string(),
  boardingOrder: z.number(),
  alightingOrder: z.number(),
  ticketStatus: z.enum(["issued", "used", "cancelled"]),
});

export type BookingRequestDTOType = z.infer<typeof BookingRequestDTOSchema>;
export type ResBookingHistoryDTOType = z.infer<
  typeof ResBookingHistoryDTOSchema
>;
export type ResTicketHistoryDTOType = z.infer<typeof ResTicketHistoryDTOSchema>;
export type BookingType = z.infer<typeof BookingSchema>;
export type TicketType = z.infer<typeof TicketSchema>;
