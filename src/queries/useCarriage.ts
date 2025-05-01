import carriagesApiRequest from "@/apiRequests/carriage";
import { UpdateCarriageBodyType } from "@/schemaValidations/carriage.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCarriageList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["carriages", page, size],
    queryFn: () => carriagesApiRequest.listCarriage(page, size),
  });
};
export const useGetCarriage = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["carriages", id],
    queryFn: () => carriagesApiRequest.getCarriage(id),
    enabled,
  });
};

export const useAddCarriageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carriagesApiRequest.addCarriage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carriages"],
      });
    },
  });
};

export const useUpdateCarriageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateCarriageBodyType & { id: number }) =>
      carriagesApiRequest.updateCarriage(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carriages"],
      });
    },
  });
};
export const useDeleteCarriageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carriagesApiRequest.deleteCarriage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carriages"],
      });
    },
  });
};
