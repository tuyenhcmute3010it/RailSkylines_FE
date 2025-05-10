import bookingApiRequest from "@/apiRequests/booking";
import { CreateBookingBodyType } from "@/schemaValidations/booking.shema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      body,
      ticketsParam,
    }: {
      body: CreateBookingBodyType;
      ticketsParam: string;
    }) => bookingApiRequest.createBooking(body, ticketsParam),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
  });
};

export const useGetBookingHistory = () => {
  return useQuery({
    queryKey: ["bookings", "history"],
    queryFn: () => bookingApiRequest.getBookingHistory(),
  });
};
