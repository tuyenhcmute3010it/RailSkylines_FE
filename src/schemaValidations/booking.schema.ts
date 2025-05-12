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
