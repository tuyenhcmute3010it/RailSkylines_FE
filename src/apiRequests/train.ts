import http from "@/lib/http";

import {
  CreateTrainBodyType,
  TrainListResType,
  TrainResType,
  UpdateTrainBodyType,
} from "@/schemaValidations/train.schema";
const prefix = "/api/v1/trains";
const trainsApiRequest = {
  // list: () => http.get<TrainListResType>(`${prefix}`),
  list: (page: number = 1, size: number = 10) =>
    http.get<TrainListResType>(`${prefix}?page=${page}&size=${size}`),
  addTrain: (body: CreateTrainBodyType) =>
    http.post<TrainResType>(`${prefix}`, body),
  updateTrain: (id: number, body: UpdateTrainBodyType) =>
    http.put<TrainResType>(`${prefix}/${id}`, body),
  getTrain: (id: number) => http.get<TrainResType>(`${prefix}/${id}`),
  deleteTrain: (id: number) => http.delete<TrainResType>(`${prefix}/${id}`),
};
export default trainsApiRequest;
