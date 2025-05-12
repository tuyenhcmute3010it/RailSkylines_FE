// export type CreateBookingBodyType = {
//   seatIds: number[];
//   userId?: number | null;
//   contactEmail: string;
//   contactPhone?: string;
//   promotionIds?: number[];
//   tickets: {
//     name: string;
//     citizenId: string;
//     customerObject: "ADULT" | "CHILD" | "STUDENT";
//   }[];
//   paymentType: string;
//   // ticketsParam: string;
// };

// export type BookingResType = {
//   statusCode: number;
//   message: string;
//   data: string; // Payment URL
//   error: string | null;
// };

// // export type BookingListResType = {
// //   statusCode: number;
// //   message: string;
// //   data: {
// //     bookingId: number;
// //     bookingCode: string;
// //     date: string;
// //     paymentStatus: "pending" | "success" | "failed";
// //     totalPrice: number;
// //     payAt?: string;
// //     transactionId?: string;
// //     vnpTxnRef?: string;
// //     paymentType: string;
// //     contactEmail: string;
// //     contactPhone?: string;
// //     tickets: {
// //       name: string;
// //       citizenId: string;
// //       customerObject: "ADULT" | "CHILD" | "STUDENT";
// //       price: number;
// //       seat: {
// //         seatId: number;
// //         seatNumber: number;
// //         price: number;
// //       };
// //     }[];
// //     promotions?: { promotionId: number; discount: number }[];
// //   }[];
// //   error: string | null;
// // };

// export type BookingListResType = {
//   statusCode: number;
//   error: string | null;
//   message: string;
//   data: any[];
// };
// export type CreateBookingBodyType = {
//   contactEmail: string;
//   contactPhone?: string;
//   promotionIds?: number[];
//   tickets: {
//     name: string;
//     citizenId: string;
//     customerObject: "adult" | "child" | "student"; // Lowercase
//   }[];
//   paymentType: string;
// };
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
