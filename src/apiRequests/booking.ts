// // import http from "@/lib/http";
// // import {
// //   BookingListResType,
// //   BookingResType,
// //   CreateBookingBodyType,
// // } from "@/schemaValidations/booking.shema";

// // const prefix = "/api/v1/bookings";

// // const bookingApiRequest = {
// //   // Create a new booking
// //   createBooking: (body: CreateBookingBodyType, ticketsParam: string) =>
// //     http.post<BookingResType>(`${prefix}`, body, {
// //       params: { tickets: ticketsParam },
// //     }),

// //   // Get booking history for the authenticated user
// //   getBookingHistory: () => http.get<BookingListResType>(`${prefix}/history`),
// // };

// // export default bookingApiRequest;

// // src/apiRequests/booking.ts
// import http from "@/lib/http";
// import {
//   BookingListResType,
//   BookingResType,
//   CreateBookingBodyType,
// } from "@/schemaValidations/booking.shema";

// const prefix = "/api/v1/bookings";

// const bookingApiRequest = {
//   // Create a new booking
//   // createBooking: (body: CreateBookingBodyType, ticketsParam: string) => {
//   //   // Log the ticketsParam to verify its content
//   //   console.log("ticketsParam:", ticketsParam);

//   //   // Ensure ticketsParam is URL-encoded
//   //   const encodedTickets = encodeURIComponent(ticketsParam);

//   //   // Log the full request URL for debugging
//   //   const requestUrl = `${prefix}?tickets=${encodedTickets}`;
//   //   console.log("Request URL:", requestUrl);

//   //   return http.post<BookingResType>(prefix, body, {
//   //     params: { tickets: ticketsParam }, // Pass tickets as query param
//   //   });
//   // },
//   createBooking: (body: CreateBookingBodyType, ticketsParam: string) => {
//     console.log("ticketsParam:", ticketsParam);
//     const encodedTickets = encodeURIComponent(ticketsParam);
//     console.log("Request URL:", `${prefix}?tickets=${encodedTickets}`);
//     return http.post<BookingResType>(prefix, body, {
//       params: { tickets: ticketsParam },
//     });
//   },

//   // Get booking history for the authenticated user
//   getBookingHistory: () => http.get<BookingListResType>(`${prefix}/history`),
// };

// export default bookingApiRequest;
import http, { HttpError } from "@/lib/http"; // Import HttpError directly
import {
  BookingListResType,
  BookingResType,
  CreateBookingBodyType,
} from "@/schemaValidations/booking.shema";

const prefix = "/api/v1/bookings";

const bookingApiRequest = {
  createBooking: async (body: CreateBookingBodyType, ticketsParam: string) => {
    const encodedTickets = encodeURIComponent(ticketsParam);
    console.log(">>>>>>> Sending booking request:", {
      url: `${prefix}?tickets=${encodedTickets}`,
      body,
      ticketsParam,
      encodedTickets,
    });
    try {
      const response = await http.post<BookingResType>(prefix, body, {
        params: { tickets: ticketsParam }, // Use 'tickets'
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(">>>>>>> Booking response:", {
        status: response.status,
        payload: response.payload,
      });
      return response;
    } catch (error: any) {
      console.log(">>>>>>> Booking request error:", {
        error,
        status: error.status,
        payload: error.payload,
        message: error.message,
      });
      let errorMessage = error.message || "Lỗi khi tạo đặt vé";
      if (error.payload && typeof error.payload === "string") {
        const match = error.payload.match(/<p><b>Message<\/b> (.*?)<\/p>/);
        if (match && match[1]) {
          errorMessage = match[1];
        }
      }
      throw new HttpError({
        status: error.status || 500,
        payload: error.payload,
        message: errorMessage,
      });
    }
  },

  getBookingHistory: () => http.get<BookingListResType>(`${prefix}/history`),
};

export default bookingApiRequest;
