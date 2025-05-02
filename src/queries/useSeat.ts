import seatsApiRequest from "@/apiRequests/seat";
import {
  CreateSeatBodyType,
  UpdateSeatBodyType,
} from "@/schemaValidations/seat.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Existing hook for fetching seats (provided)
// New mutation hooks for seats
export const useAddSeatMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seatsApiRequest.addSeat,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seats"],
      });
    },
  });
};

export const useUpdateSeatMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateSeatBodyType & { id: number }) =>
      seatsApiRequest.updateSeat(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seats"],
      });
    },
  });
};
export const useDeleteSeatMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seatsApiRequest.deleteSeat,
    onSuccess: () => {
      // Invalidate seat queries (requires fetching the carriageId separately if needed)
      queryClient.invalidateQueries({
        queryKey: ["seats"],
      });
    },
  });
};
