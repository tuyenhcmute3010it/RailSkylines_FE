// // // import http from "@/lib/http";
// // // import {
// // //   BookingListResType,
// // //   BookingResType,
// // //   CreateBookingBodyType,
// // // } from "@/schemaValidations/booking.shema";

// // // const prefix = "/api/v1/bookings";

// // // const bookingApiRequest = {
// // //   // Create a new booking
// // //   createBooking: (body: CreateBookingBodyType, ticketsParam: string) =>
// // //     http.post<BookingResType>(`${prefix}`, body, {
// // //       params: { tickets: ticketsParam },
// // //     }),

// // //   // Get booking history for the authenticated user
// // //   getBookingHistory: () => http.get<BookingListResType>(`${prefix}/history`),
// // // };

// // // export default bookingApiRequest;

// // // src/apiRequests/booking.ts
// // import http from "@/lib/http";
// // import {
// //   BookingListResType,
// //   BookingResType,
// //   CreateBookingBodyType,
// // } from "@/schemaValidations/booking.shema";

// // const prefix = "/api/v1/bookings";

// // const bookingApiRequest = {
// //   // Create a new booking
// //   // createBooking: (body: CreateBookingBodyType, ticketsParam: string) => {
// //   //   // Log the ticketsParam to verify its content
// //   //   console.log("ticketsParam:", ticketsParam);

// //   //   // Ensure ticketsParam is URL-encoded
// //   //   const encodedTickets = encodeURIComponent(ticketsParam);

// //   //   // Log the full request URL for debugging
// //   //   const requestUrl = `${prefix}?tickets=${encodedTickets}`;
// //   //   console.log("Request URL:", requestUrl);

// //   //   return http.post<BookingResType>(prefix, body, {
// //   //     params: { tickets: ticketsParam }, // Pass tickets as query param
// //   //   });
// //   // },
// //   createBooking: (body: CreateBookingBodyType, ticketsParam: string) => {
// //     console.log("ticketsParam:", ticketsParam);
// //     const encodedTickets = encodeURIComponent(ticketsParam);
// //     console.log("Request URL:", `${prefix}?tickets=${encodedTickets}`);
// //     return http.post<BookingResType>(prefix, body, {
// //       params: { tickets: ticketsParam },
// //     });
// //   },

// //   // Get booking history for the authenticated user
// //   getBookingHistory: () => http.get<BookingListResType>(`${prefix}/history`),
// // };

// // export default bookingApiRequest;
// import http, { HttpError } from "@/lib/http"; // Import HttpError directly
// import {
//   BookingListResType,
//   BookingResType,
//   CreateBookingBodyType,
// } from "@/schemaValidations/booking.shema";

// const prefix = "/api/v1/bookings";

// const bookingApiRequest = {
//   // createBooking: async (body: CreateBookingBodyType, ticketsParam: string) => {
//   //   const encodedTickets = encodeURIComponent(ticketsParam);
//   //   console.log(">>>>>>> Sending booking request:", {
//   //     url: `${prefix}?tickets=${encodedTickets}`,
//   //     body,
//   //     ticketsParam,
//   //     encodedTickets,
//   //   });
//   //   try {
//   //     const response = await http.post<BookingResType>(prefix, body, {
//   //       params: { tickets: ticketsParam },
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //     });
//   //     console.log(">>>>>>> Booking response:", {
//   //       status: response.status,
//   //       payload: response.payload,
//   //     });
//   //     return response;
//   //   } catch (error: any) {
//   //     console.log(">>>>>>> Booking request error:", {
//   //       error,
//   //       status: error.status,
//   //       payload: error.payload,
//   //       message: error.message,
//   //     });
//   //     let errorMessage = error.message || "Lỗi khi tạo đặt vé";
//   //     if (error.payload && typeof error.payload === "string") {
//   //       const match = error.payload.match(/<p><b>Message<\/b> (.*?)<\/p>/);
//   //       if (match && match[1]) {
//   //         errorMessage = match[1];
//   //       }
//   //     }
//   //     throw new HttpError({
//   //       status: error.status || 500,
//   //       payload: error.payload,
//   //       message: errorMessage,
//   //     });
//   //   }
//   // },

//   // createBooking: async ({
//   //   body,
//   //   ticketsParam,
//   //   trainTripId,
//   // }: {
//   //   body: CreateBookingBodyType;
//   //   ticketsParam: string;
//   //   trainTripId: number;
//   // }) => {
//   //   const encodedTickets = encodeURIComponent(ticketsParam);
//   //   const requestUrl = `${prefix}?tickets=${encodedTickets}&trainTripId=${trainTripId}`;
//   //   console.log(">>>>>>> Sending booking request:", {
//   //     url: requestUrl,
//   //     body,
//   //     ticketsParam,
//   //     encodedTickets,
//   //     trainTripId,
//   //   });
//   //   try {
//   //     const response = await http.post<BookingResType>(prefix, body, {
//   //       params: {
//   //         tickets: ticketsParam,
//   //         trainTripId,
//   //       },
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //     });
//   //     console.log(">>>>>>> Booking response:", {
//   //       status: response.status,
//   //       payload: response.payload,
//   //     });
//   //     return response;
//   //   } catch (error: any) {
//   //     console.error(">>>>>>> Booking request error:", {
//   //       error,
//   //       status: error.status,
//   //       payload: error.payload,
//   //       message: error.message,
//   //     });
//   //     let errorMessage = error.message || "Lỗi khi tạo đặt vé";
//   //     if (error.payload && typeof error.payload === "string") {
//   //       const match = error.payload.match(/<p><b>Message<\/b> (.*?)<\/p>/);
//   //       if (match && match[1]) {
//   //         errorMessage = match[1];
//   //       }
//   //     }
//   //     throw new HttpError({
//   //       status: error.status || 500,
//   //       payload: error.payload,
//   //       message: errorMessage,
//   //     });
//   //   }
//   // },
//   //
//   createBooking: async ({
//     body,
//     ticketsParam,
//     trainTripId,
//   }: {
//     body: CreateBookingBodyType;
//     ticketsParam: string;
//     trainTripId: number;
//   }) => {
//     if (!ticketsParam) {
//       throw new Error("ticketsParam is required");
//     }
//     try {
//       JSON.parse(ticketsParam); // Validate ticketsParam is valid JSON
//     } catch {
//       throw new Error("Invalid ticketsParam format");
//     }
//     const encodedTickets = encodeURIComponent(ticketsParam);
//     const requestUrl = `${prefix}?tickets=${encodedTickets}&trainTripId=${trainTripId}`;
//     console.log(">>>>>>> Sending booking request:", {
//       url: requestUrl,
//       body: JSON.stringify(body, null, 2),
//       ticketsParam,
//       encodedTickets,
//       trainTripId,
//     });
//     try {
//       const response = await http.post<BookingResType>(prefix, body, {
//         params: {
//           tickets: ticketsParam,
//           trainTripId,
//         },
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       });
//       console.log(">>>>>>> Booking response:", {
//         status: response.status,
//         payload: response.payload,
//       });
//       return response;
//     } catch (error: any) {
//       console.error(">>>>>>> Booking request error:", {
//         error,
//         status: error.status,
//         payload: error.payload,
//         message: error.message,
//       });
//       let errorMessage = error.message || "Lỗi khi tạo đặt vé";
//       if (error.payload && typeof error.payload === "string") {
//         const match = error.payload.match(/<p><b>Message<\/b> (.*?)<\/p>/);
//         if (match && match[1]) {
//           errorMessage = match[1];
//         }
//       }
//       throw new HttpError({
//         status: error.status || 500,
//         payload: error.payload,
//         message: errorMessage,
//       });
//     }
//   },
//   getBookingById: (bookingId: string) =>
//     http.get<BookingResType>(`${prefix}/${bookingId}`),
//   getBookingHistory: () => http.get<BookingListResType>(`${prefix}/history`),
// };

// export default bookingApiRequest;
import http, { HttpError } from "@/lib/http";
import {
  BookingListResType,
  BookingResType,
  CreateBookingBodyType,
} from "@/schemaValidations/booking.shema";

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
  getBookingHistory: () => http.get<BookingListResType>(`${prefix}/history`),
};

export default bookingApiRequest;
