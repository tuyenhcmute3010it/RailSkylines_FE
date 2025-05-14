import seatsApiRequest, { SeatQueryParams } from "@/apiRequests/seat";
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
export const useGetAvailableSeats = ({
  trainTripId,
  boardingStationId,
  alightingStationId,
  enabled,
}: SeatQueryParams & { enabled: boolean }) => {
  return useQuery({
    queryKey: ["seats", trainTripId, boardingStationId, alightingStationId],
    queryFn: () =>
      seatsApiRequest.listAvailableSeats({
        trainTripId,
        boardingStationId,
        alightingStationId,
      }),
    enabled,
    select: (response) => response.data, // Extract the data array
  });
};
