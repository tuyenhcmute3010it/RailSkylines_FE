import stationsApiRequest from "@/apiRequests/station";
import { UpdateStationBodyType } from "@/schemaValidations/station.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetStationList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["stations", page, size],
    queryFn: () => stationsApiRequest.listStation(page, size),
  });
};

export const useGetStation = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["stations", id],
    queryFn: () => stationsApiRequest.getStation(id),
    enabled,
  });
};

export const useAddStationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stationsApiRequest.addStation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stations"],
      });
    },
  });
};

export const useUpdateStationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateStationBodyType & { id: number }) =>
      stationsApiRequest.updateStation(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stations"],
      });
    },
  });
};

export const useDeleteStationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stationsApiRequest.deleteStation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stations"],
      });
    },
  });
};
