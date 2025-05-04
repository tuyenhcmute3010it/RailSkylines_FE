import http from "@/lib/http";
import {
  CreateTrainTripBodyType,
  TrainTripListResType,
  TrainTripResType,
  UpdateTrainTripBodyType,
} from "@/schemaValidations/trainTrip.schema";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const prefix = "/api/v1/train-trips";
const trainTripApiRequest = {
  list: (page: number = 1, size: number = 10) =>
    http.get<TrainTripListResType>(`${prefix}?page=${page}&size=${size}`),
  addTrainTrip: (body: CreateTrainTripBodyType) =>
    http.post<TrainTripResType>(`${prefix}`, body),
  updateTrainTrip: (id: number, body: UpdateTrainTripBodyType) =>
    http.put<TrainTripResType>(`${prefix}/${id}`, body),
  getTrainTrip: (id: number) => http.get<TrainTripResType>(`${prefix}/${id}`),
  deleteTrainTrip: (id: number) =>
    http.delete<TrainTripResType>(`${prefix}/${id}`),
};
export default trainTripApiRequest;

export const useGetTrainTripList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["trainTrips", page, size],
    queryFn: () => trainTripApiRequest.list(page, size),
  });
};

export const useGetTrainTrip = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["trainTrips", id],
    queryFn: () => trainTripApiRequest.getTrainTrip(id),
    enabled,
  });
};

export const useAddTrainTripMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trainTripApiRequest.addTrainTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainTrips"],
      });
    },
  });
};

export const useUpdateTrainTripMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTrainTripBodyType & { id: number }) =>
      trainTripApiRequest.updateTrainTrip(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainTrips"],
      });
    },
  });
};

export const useDeleteTrainTripMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trainTripApiRequest.deleteTrainTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainTrips"],
      });
    },
  });
};
