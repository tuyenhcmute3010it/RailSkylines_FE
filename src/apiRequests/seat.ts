import http from "@/lib/http";
import {
  CreateSeatBodyType,
  SeatResType,
  UpdateSeatBodyType,
} from "@/schemaValidations/seat.schema";
export interface Seat {
  seatId: number;
  seatStatus: "available" | "unavailable";
  price: number;
  seatType: "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
  carriage: {
    carriageId: number;
    carriageType: "sixBeds";
    price: number;
    discount: number;
    train: {
      trainId: number;
      trainName: string;
      trainStatus: string;
    };
  };
}

export interface SeatListResType {
  data: Seat[];
}

export interface SeatQueryParams {
  trainTripId: number;
  boardingStationId: number;
  alightingStationId: number;
}
const prefix = "/api/v1/seats";
const seatsApiRequest = {
  listSeat: (page: number = 1, size: number = 10) =>
    http.get<SeatListResType>(`${prefix}?page=${page}&size=${size}`),
  addSeat: (body: CreateSeatBodyType) =>
    http.post<SeatResType>(`${prefix}`, body),
  updateSeat: (id: number, body: UpdateSeatBodyType) =>
    http.put<SeatResType>(`${prefix}/${id}`, body),
  getSeat: (id: number) => http.get<SeatResType>(`${prefix}/${id}`),
  deleteSeat: (id: number) => http.delete<SeatResType>(`${prefix}/${id}`),
  listAvailableSeats: ({
    trainTripId,
    boardingStationId,
    alightingStationId,
  }: SeatQueryParams) =>
    http.get<SeatListResType>(
      `${prefix}/available?trainTripId=${trainTripId}&boardingStationId=${boardingStationId}&alightingStationId=${alightingStationId}`
    ),
};

export default seatsApiRequest;
