import http from "@/lib/http";
import {
  StationListResType,
  StationResType,
  CreateStationBodyType,
  UpdateStationBodyType,
} from "@/schemaValidations/station.schema";

const prefix = "/api/v1/stations";

const stationsApiRequest = {
  listStation: (page: number = 1, size: number = 10) =>
    http.get<StationListResType>(`${prefix}?page=${page}&size=${size}`),
  addStation: (body: CreateStationBodyType) =>
    http.post<StationResType>(`${prefix}`, body),
  updateStation: (id: number, body: UpdateStationBodyType) =>
    http.put<StationResType>(`${prefix}/${id}`, body),
  getStation: (id: number) => http.get<StationResType>(`${prefix}/${id}`),
  deleteStation: (id: number) => http.delete<StationResType>(`${prefix}/${id}`),
};

export default stationsApiRequest;
