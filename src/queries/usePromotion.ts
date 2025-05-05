import promotionsApiRequest from "@/apiRequests/promotion";
import { UpdatePromotionBodyType } from "@/schemaValidations/promotion.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetPromotionList = (page: number, size: number) => {
  return useQuery({
    queryKey: ["promotions", page, size],
    queryFn: () => promotionsApiRequest.listPromotion(page, size),
  });
};

export const useGetPromotion = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["promotions", id],
    queryFn: () => promotionsApiRequest.getPromotion(id),
    enabled,
  });
};

export const useAddPromotionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionsApiRequest.addPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promotions"],
      });
    },
  });
};

export const useUpdatePromotionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdatePromotionBodyType & { id: number }) =>
      promotionsApiRequest.updatePromotion(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promotions"],
      });
    },
  });
};

export const useDeletePromotionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: promotionsApiRequest.deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promotions"],
      });
    },
  });
};
