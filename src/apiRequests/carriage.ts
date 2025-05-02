import http from "@/lib/http";
import {
  CarriageListResType,
  CarriageResType,
  CreateCarriageBodyType,
  UpdateCarriageBodyType,
} from "@/schemaValidations/carriage.schema";
import { SeatListResType } from "@/schemaValidations/seat.schema";

const prefix = "/api/v1/carriages";
const carriagesApiRequest = {
  listCarriage: (page: number = 1, size: number = 10) =>
    http.get<CarriageListResType>(`${prefix}?page=${page}&size=${size}`),
  addCarriage: (body: CreateCarriageBodyType) =>
    http.post<CarriageResType>(`${prefix}`, body),
  updateCarriage: (id: number, body: UpdateCarriageBodyType) =>
    http.put<CarriageResType>(`${prefix}/${id}`, body),
  getCarriage: (id: number) => http.get<CarriageResType>(`${prefix}/${id}`),
  deleteCarriage: (id: number) =>
    http.delete<CarriageResType>(`${prefix}/${id}`),

  getSeatByCarriage: (id: number, page: number = 1, size: number = 10) =>
    http.get<SeatListResType>(`${prefix}/seat/${id}?page${page}&size=${size}`), // Assuming it returns an array of Seat
};

export default carriagesApiRequest;
