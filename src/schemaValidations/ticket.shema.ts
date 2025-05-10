export interface TicketResponse {
  status: number;
  payload: {
    statusCode: number;
    error: string | null;
    message: string;
    data: {
      ticketId: number;
      customerObject: "adult" | "children" | "student";
      ticketCode: string;
      name: string;
      citizenId: string;
      price: number;
      startDay: string | null;
      ticketStatus: string;
      seat: {
        seatId: number;
        price: number;
        seatStatus: string;
      };
      trainTrip: {
        trainTripId: number;
        departure: string | null;
        arrival: string | null;
        train: {
          trainId: number;
          trainName: string;
        };
      };
    };
  };
}
