import http, { HttpError } from "@/lib/http";
import { TicketResponse } from "@/schemaValidations/ticket.shema";

const prefix = "/api/v1/tickets";

const ticketApiRequest = {
  getTicketByCode: async (ticketCode: string) => {
    try {
      const response = await http.get<TicketResponse>(
        `${prefix}/${ticketCode}`
      );
      console.log(">>>>>>> Ticket response:", {
        status: response.status,
        payload: response.payload,
      });
      return response;
    } catch (error: any) {
      console.log(">>>>>>> Ticket request error:", {
        error,
        status: error.status,
        payload: error.payload,
        message: error.message,
      });
      throw new HttpError({
        status: error.status || 500,
        payload: error.payload,
        message: error.message || "Lỗi khi lấy thông tin vé",
      });
    }
  },
};

export default ticketApiRequest;
