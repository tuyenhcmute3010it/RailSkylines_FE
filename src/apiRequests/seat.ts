import http from "@/lib/http";
import {
  CreateSeatBodyType,
  SeatListResType,
  SeatResType,
  UpdateSeatBodyType,
} from "@/schemaValidations/seat.schema";

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
};

export default seatsApiRequest;
