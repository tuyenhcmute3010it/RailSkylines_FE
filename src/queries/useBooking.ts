import bookingApiRequest from "@/apiRequests/booking";
import { CreateBookingBodyType } from "@/schemaValidations/booking.shema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export const useCreateBookingMutation = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       body,
//       ticketsParam,
//     }: {
//       body: CreateBookingBodyType;
//       ticketsParam: string;
//     }) => bookingApiRequest.createBooking(body, ticketsParam),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["bookings"],
//       });
//     },
//   });
// };

// export const useCreateBookingMutation = () => {
//   return useMutation({
//     mutationFn: ({
//       body,
//       ticketsParam,
//       trainTripId,
//     }: {
//       body: CreateBookingBodyType;
//       ticketsParam: string;
//       trainTripId: number;
//     }) => bookingApiRequest.createBooking({ body, ticketsParam, trainTripId }),
//     onError: (error: any) => {
//       console.error(">>>>>>> useCreateBookingMutation error:", {
//         status: error.status,
//         message: error.message,
//         payload: error.payload,
//       });
//     },
//   });
// };
// export const useCreateBookingMutation = () => {
//   return useMutation({
//     mutationFn: ({
//       body,
//       trainTripId,
//     }: {
//       body: CreateBookingBodyType;
//       trainTripId: number;
//     }) => bookingApiRequest.createBooking({ body, trainTripId }),
//     onError: (error: any) => {
//       console.error(">>>>>>> useCreateBookingMutation error:", {
//         status: error.status,
//         message: error.message,
//         payload: error.payload,
//       });
//     },
//   });
// };
export const useCreateBookingMutation = () => {
  return useMutation({
    mutationFn: ({
      body,
      ticketsParam,
      trainTripId,
    }: {
      body: CreateBookingBodyType;
      ticketsParam: string;
      trainTripId: number;
    }) => bookingApiRequest.createBooking({ body, ticketsParam, trainTripId }),
    onError: (error: any) => {
      console.error(">>>>>>> useCreateBookingMutation error:", {
        status: error.status,
        message: error.message,
        payload: error.payload,
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
