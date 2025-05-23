import http, { HttpError } from "@/lib/http";
import {
  BookingListResType,
  BookingResType,
  BookingType,
  CreateBookingBodyType,
  ResBookingHistoryDTOType,
  ResTicketHistoryDTOType,
  TicketType,
} from "@/schemaValidations/booking.schema";

const prefix = "/api/v1/bookings";

const bookingApiRequest = {
  createBooking: async ({
    body,
    ticketsParam,
    trainTripId,
  }: {
    body: CreateBookingBodyType;
    ticketsParam: string;
    trainTripId: number;
  }) => {
    if (!ticketsParam) {
      throw new Error("ticketsParam is required");
    }
    try {
      JSON.parse(ticketsParam);
    } catch {
      throw new Error("Invalid ticketsParam format");
    }
    const encodedTickets = encodeURIComponent(ticketsParam);
    const requestUrl = `${prefix}?tickets=${encodedTickets}&trainTripId=${trainTripId}`;
    console.log(">>>>>>> Sending booking request:", {
      url: requestUrl,
      body: JSON.stringify(body, null, 2),
      ticketsParam,
      encodedTickets,
      trainTripId,
      accessToken: localStorage.getItem("accessToken")?.slice(0, 10) + "...",
    });
    try {
      const response = await http.post<BookingResType>(prefix, body, {
        params: {
          tickets: ticketsParam,
          trainTripId,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log(">>>>>>> Booking response:", {
        status: response.status,
        payload: response.payload,
      });
      return response;
    } catch (error: any) {
      console.error(">>>>>>> Booking request error:", {
        error,
        status: error.status,
        payload: error.payload,
        message: error.message,
      });
      let errorMessage = error.message || "Lỗi khi tạo đặt vé";
      if (error.status === 403) {
        errorMessage = "Bạn không có quyền truy cập endpoint này.";
      } else if (error.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.payload && typeof error.payload === "string") {
        const match = error.payload.match(/<p><b>Message<\/b> (.*?)<\/p>/);
        if (match && match[1]) {
          errorMessage = match[1];
        }
      } else if (!error.payload) {
        errorMessage = "Không nhận được phản hồi JSON từ server.";
      }
      throw new HttpError({
        status: error.status || 500,
        payload: error.payload,
        message: errorMessage,
      });
    }
  },
  getBookingById: (bookingId: string) =>
    http.get<BookingResType>(`${prefix}/${bookingId}`),

  searchBooking: (bookingCode: string, vnpTxnRef: string) =>
    http.get<BookingType>(
      `/bookings/search?bookingCode=${bookingCode}&vnpTxnRef=${vnpTxnRef}`
    ),
  searchTicket: (ticketCode: string, citizenId: string) =>
    http.get<TicketType>(
      `/tickets/search?ticketCode=${ticketCode}&citizenId=${citizenId}`
    ),
  getTicketHistory: (email: string) =>
    http.get<ResTicketHistoryDTOType[]>(`/tickets/history`, {
      params: { email },
    }),
  getBookingHistory: async () => {
    try {
      const response = await http.get<{
        statusCode: number;
        error: string | null;
        message: string;
        data: ResBookingHistoryDTOType[];
      }>(`${prefix}/history`);
      return response;
    } catch (error: any) {
      let errorMessage = error.message || "Failed to fetch booking history";
      if (error.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.status === 403) {
        errorMessage = "Bạn không có quyền truy cập endpoint này.";
      }
      throw new HttpError({
        status: error.status || 500,
        payload: error.payload,
        message: errorMessage,
      });
    }
  },
};

export default bookingApiRequest;
