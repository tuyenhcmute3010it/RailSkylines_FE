import trainsApiRequest from "@/apiRequests/train";
import { UpdateTrainBodyType } from "@/schemaValidations/train.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTrainList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["trains", page, size],
    queryFn: () => trainsApiRequest.list(page, size),
  });
};
export const useGetTrain = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["trains", id],
    queryFn: () => trainsApiRequest.getTrain(id),
    enabled,
  });
};

export const useAddTrainMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trainsApiRequest.addTrain,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trains"],
      });
    },
  });
};
console.log(">>>>>>>>>", trainsApiRequest.addTrain);

export const useUpdateTrainMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTrainBodyType & { id: number }) =>
      trainsApiRequest.updateTrain(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trains"],
      });
    },
  });
};
export const useDeleteTrainMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trainsApiRequest.deleteTrain,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trains"],
      });
    },
  });
};
