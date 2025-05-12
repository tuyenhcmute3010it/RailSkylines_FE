// "use client";
// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import SearchTicket from "../search-ticket";
// import { Trash2 } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { format } from "date-fns";
// import trainTripApiRequest from "@/queries/useTrainTrip";
// import { useUpdateSeatMutation } from "@/queries/useSeat"; // Import the seat mutation hook
// import TrainTripSkeleton from "@/components/TrainTripSkeleton";
// import NoResults from "@/components/no-Result";

// // Define interfaces based on API schema
// interface Station {
//   stationId: number;
//   stationName: string;
//   position: number;
// }

// interface Train {
//   trainId: number;
//   trainName: string;
//   trainStatus: string;
//   carriages: Carriage[];
// }

// interface Route {
//   routeId: number;
//   originStation: Station;
//   journey: Station[];
// }

// interface Schedule {
//   scheduleId: number;
//   departure: {
//     clockTimeId: number;
//     date: string;
//     hour: number;
//     minute: number;
//   };
//   arrival: {
//     clockTimeId: number;
//     date: string;
//     hour: number;
//     minute: number;
//   };
// }

// interface Seat {
//   seatId: number;
//   seatNumber: number | null;
//   seatType: string;
//   seatStatus: string;
//   price: number;
// }

// interface Carriage {
//   carriageId: number;
//   carriageType: "fourBeds" | "sixBeds" | "seat";
//   price: number;
//   discount: number;
//   seats: Seat[];
// }

// interface FrontendCarriage {
//   id: number;
//   name: string;
//   type: "4-bed" | "6-bed" | "seat";
//   basePrice: number;
//   seats: number[];
//   bookedSeats: number[];
//   pendingSeats: number[]; // New field to track pending seats
//   discount: number;
//   seatData: Seat[];
// }

// interface FrontendTrain {
//   id: string;
//   name: string;
//   departure: string;
//   arrival: string;
//   availableSeats: number;
//   carriages: FrontendCarriage[];
//   trainTripId: number;
// }

// export type TrainTrip = {
//   trainTripId: number;
//   train: { trainId: number; trainName: string; trainStatus: string };
//   route: {
//     routeId: number;
//     originStation: { stationId: number; stationName: string; position: number };
//     journey: { stationId: number; stationName: string; position: number }[];
//   };
//   schedule: {
//     scheduleId: number;
//     departure: {
//       clockTimeId: number;
//       date: string;
//       hour: number;
//       minute: number;
//     };
//     arrival: {
//       clockTimeId: number;
//       date: string;
//       hour: number;
//       minute: number;
//     };
//   };
// };

// export interface SearchData {
//   departureStation: string | null;
//   arrivalStation: string | null;
//   tripType: string | null;
//   departureDate: string | null;
//   returnDate: string | null;
// }

// interface CartItem {
//   trainId: string;
//   trainName: string;
//   coachName: string;
//   coachId: number;
//   seatNumber: number;
//   departure: string;
//   arrival: string;
//   timestamp: number;
//   price: number;
// }

// // Validate date and time inputs
// const isValidDateString = (dateStr: string): boolean => {
//   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//   if (!dateRegex.test(dateStr)) return false;
//   const date = new Date(dateStr);
//   return !isNaN(date.getTime());
// };

// const isValidTime = (hour: number, minute: number): boolean => {
//   return (
//     Number.isInteger(hour) ||
//     (Number.isInteger(Math.floor(hour)) &&
//       hour >= 0 &&
//       hour <= 23 &&
//       Number.isInteger(minute) &&
//       minute >= 0 &&
//       minute <= 59)
//   );
// };

// // Map API train trips to frontend format
// const mapTrainTripsToFrontend = (trainTrips: TrainTrip[]): FrontendTrain[] => {
//   const fallbackDateTime = new Date();
//   return trainTrips
//     .filter((trip) => {
//       if (!trip.schedule) {
//         console.warn(`TrainTrip ${trip.trainTripId} is missing schedule data`);
//         return false;
//       }
//       const { departure, arrival } = trip.schedule;
//       if (
//         !isValidDateString(departure.date.split("T")[0]) ||
//         !isValidDateString(arrival.date.split("T")[0]) ||
//         !isValidTime(departure.hour, departure.minute) ||
//         !isValidTime(arrival.hour, arrival.minute)
//       ) {
//         console.warn(`TrainTrip ${trip.trainTripId} has invalid schedule data`);
//         return false;
//       }
//       return true;
//     })
//     .map((trip) => {
//       const carriages = trip.train.carriages
//         .filter((carriage) => carriage.seats.length > 0)
//         .map((carriage) => {
//           const maxSeats =
//             carriage.carriageType === "fourBeds"
//               ? 28
//               : carriage.carriageType === "sixBeds"
//               ? 42
//               : 56;
//           const limitedSeats = carriage.seats.slice(0, maxSeats);

//           return {
//             id: carriage.carriageId,
//             name: `Carriage ${carriage.carriageId}`,
//             type:
//               carriage.carriageType === "fourBeds"
//                 ? "4-bed"
//                 : carriage.carriageType === "sixBeds"
//                 ? "6-bed"
//                 : "seat",
//             basePrice: carriage.price,
//             seats: limitedSeats.map((seat) => seat.seatId),
//             bookedSeats: limitedSeats
//               .filter((seat) => seat.seatStatus === "booked")
//               .map((seat) => seat.seatId),
//             pendingSeats: limitedSeats
//               .filter((seat) => seat.seatStatus === "pending")
//               .map((seat) => seat.seatId), // Track pending seats
//             discount: carriage.discount,
//             seatData: limitedSeats,
//           };
//         });

//       const totalAvailableSeats = carriages.reduce(
//         (sum, carriage) =>
//           sum +
//           (carriage.seats.length -
//             carriage.bookedSeats.length -
//             carriage.pendingSeats.length),
//         0
//       );

//       const departureDateTime = new Date(trip.schedule.departure.date);
//       const arrivalDateTime = new Date(trip.schedule.arrival.date);

//       return {
//         id: `${trip.train.trainName}-${trip.trainTripId}`,
//         name: trip.train.trainName,
//         departure: !isNaN(departureDateTime.getTime())
//           ? format(departureDateTime, "dd/MM HH:mm")
//           : format(fallbackDateTime, "dd/MM HH:mm"),
//         arrival: !isNaN(arrivalDateTime.getTime())
//           ? format(arrivalDateTime, "dd/MM HH:mm")
//           : format(fallbackDateTime, "dd/MM HH:mm"),
//         availableSeats: totalAvailableSeats,
//         carriages,
//         trainTripId: trip.trainTripId,
//       };
//     });
// };

// // Filter train trips based on search parameters
// const filterTrainTrips = (
//   trainTrips: TrainTrip[],
//   departureStation: string | null,
//   arrivalStation: string | null,
//   departureDate: string | null,
//   tripType: string | null,
//   returnDate: string | null
// ): TrainTrip[] => {
//   if (!departureStation || !arrivalStation || !departureDate) {
//     console.log("Missing required parameters:", {
//       departureStation,
//       arrivalStation,
//       departureDate,
//     });
//     return [];
//   }

//   return trainTrips.filter((trip) => {
//     const allStations = [trip.route.originStation, ...trip.route.journey].map(
//       (station) => station.stationName.toLowerCase()
//     );
//     const departureIndex = allStations.indexOf(departureStation.toLowerCase());
//     const arrivalIndex = allStations.indexOf(arrivalStation.toLowerCase());

//     // Ensure both stations are found and departure comes before arrival
//     const stationMatch =
//       departureIndex !== -1 &&
//       arrivalIndex !== -1 &&
//       departureIndex < arrivalIndex;

//     // Date matching
//     const dateMatch =
//       trip.schedule?.departure.date.split("T")[0] ===
//       new Date(departureDate).toISOString().split("T")[0];

//     // Round-trip logic (placeholder for now)
//     let returnMatch = true;
//     if (tripType === "round-trip" && returnDate) {
//       // TODO: Implement round-trip filtering logic
//       returnMatch = true;
//     }

//     return stationMatch && dateMatch && returnMatch;
//   });
// };

// export default function Search() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedTrain, setSelectedTrain] = useState<FrontendTrain | null>(
//     null
//   );
//   const [selectedCoach, setSelectedCoach] = useState<FrontendCarriage | null>(
//     null
//   );
//   const [selectedSeatsByCoach, setSelectedSeatsByCoach] = useState<
//     Record<string, number[]>
//   >({});
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [timer, setTimer] = useState(600);
//   const [pendingSeats, setPendingSeats] = useState<Record<number, number>>({}); // Track seatId -> timestamp

//   // Extract search parameters
//   const departureStation = searchParams.get("departureStation");
//   const arrivalStation = searchParams.get("arrivalStation");
//   const departureDate = searchParams.get("departureDate");
//   const tripType = searchParams.get("tripType");
//   const returnDate = searchParams.get("returnDate");

//   // Fetch train trips
//   const {
//     data: trainTripsData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: [
//       "trainTrips",
//       departureStation,
//       arrivalStation,
//       departureDate,
//       tripType,
//       returnDate,
//     ],
//     queryFn: () =>
//       trainTripApiRequest.list(1, 20, {
//         departureStation: departureStation || undefined,
//         arrivalStation: arrivalStation || undefined,
//         departureDate: departureDate || undefined,
//       }),
//     select: (response) => response.payload.data.result,
//     enabled: !!departureStation && !!arrivalStation && !!departureDate,
//   });

//   // Map train trips to frontend format
//   const trains = trainTripsData
//     ? mapTrainTripsToFrontend(
//         filterTrainTrips(
//           trainTripsData,
//           departureStation,
//           arrivalStation,
//           departureDate,
//           tripType,
//           returnDate
//         )
//       )
//     : [];

//   // Use mutation for updating seat status
//   const updateSeatMutation = useUpdateSeatMutation();

//   // Handle train selection
//   const handleTrainSelect = (trainId: string) => {
//     const train = trains.find((t) => t.id === trainId) || null;
//     setSelectedTrain(train);
//     setSelectedCoach(null);
//   };

//   // Handle coach selection
//   const handleCoachSelect = (coachId: number) => {
//     if (!selectedTrain) return;
//     const coach = selectedTrain.carriages.find((c) => c.id === coachId) || null;
//     setSelectedCoach(coach);
//   };

//   const MAX_TICKETS = 10;

//   // Handle seat selection and add to cart
//   const toggleSeatSelection = async (seat: number) => {
//     if (!selectedCoach || !selectedTrain) return;
//     if (
//       selectedCoach.bookedSeats.includes(seat) ||
//       selectedCoach.pendingSeats.includes(seat)
//     )
//       return;

//     const coachKey = `${selectedTrain.id}-${selectedCoach.id}`;
//     const currentSeats = selectedSeatsByCoach[coachKey] || [];
//     const newSelectedSeats = currentSeats.includes(seat)
//       ? currentSeats.filter((s) => s !== seat)
//       : [...currentSeats, seat];
//     const isDeselecting = currentSeats.includes(seat);

//     if (!isDeselecting && cartItems.length >= MAX_TICKETS) {
//       alert(`Bạn chỉ có thể đặt tối đa ${MAX_TICKETS} vé trong một lần đặt!`);
//       return;
//     }

//     if (!isDeselecting) {
//       // Update seat status to pending in the backend
//       const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
//       if (seatData) {
//         try {
//           await updateSeatMutation.mutateAsync({
//             id: seatData.seatId,
//             // seatStatus: "pending",
//             seatNumber: seatData.seatNumber,
//             seatType: seatData.seatType,
//             price: seatData.price,
//           });
//           // Add to pending seats with timestamp
//           setPendingSeats((prev) => ({
//             ...prev,
//             [seatData.seatId]: Date.now(),
//           }));
//         } catch (error) {
//           console.error("Failed to update seat status to pending:", error);
//           return;
//         }
//       }
//     }

//     setSelectedSeatsByCoach((prev) => ({
//       ...prev,
//       [coachKey]: newSelectedSeats,
//     }));

//     if (!currentSeats.includes(seat)) {
//       const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
//       const price = seatData ? seatData.price : selectedCoach.basePrice;
//       const newCartItem: CartItem = {
//         trainId: selectedTrain.id,
//         trainName: selectedTrain.name,
//         coachName: selectedCoach.name,
//         seatNumber: seat,
//         departure: selectedTrain.departure,
//         arrival: selectedTrain.arrival,
//         coachId: selectedCoach.id,
//         timestamp: Date.now(),
//         price,
//       };
//       setCartItems((prev) => [...prev, newCartItem]);
//       setTimer(600);
//     } else {
//       // If deselecting, revert seat to available
//       const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
//       if (seatData) {
//         try {
//           await updateSeatMutation.mutateAsync({
//             id: seatData.seatId,
//             seatStatus: "available",
//             seatNumber: seatData.seatNumber,
//             seatType: seatData.seatType,
//             price: seatData.price,
//           });
//           setPendingSeats((prev) => {
//             const newPending = { ...prev };
//             delete newPending[seatData.seatId];
//             return newPending;
//           });
//         } catch (error) {
//           console.error("Failed to revert seat to available:", error);
//         }
//       }
//       setCartItems((prev) =>
//         prev.filter(
//           (item) =>
//             !(
//               item.trainId === selectedTrain.id &&
//               item.seatNumber === seat &&
//               item.coachName === selectedCoach.name
//             )
//         )
//       );
//     }
//   };

//   // Remove individual ticket from cart
//   const removeTicket = async (item: CartItem) => {
//     const coachKey = `${item.trainId}-${item.coachId}`;
//     const seatData = selectedCoach?.seatData.find(
//       (s) => s.seatId === item.seatNumber
//     );
//     if (seatData) {
//       try {
//         await updateSeatMutation.mutateAsync({
//           id: seatData.seatId,
//           seatStatus: "available",
//           seatNumber: seatData.seatNumber,
//           seatType: seatData.seatType,
//           price: seatData.price,
//         });
//         setPendingSeats((prev) => {
//           const newPending = { ...prev };
//           delete newPending[seatData.seatId];
//           return newPending;
//         });
//       } catch (error) {
//         console.error("Failed to revert seat to available:", error);
//       }
//     }
//     setCartItems((prev) =>
//       prev.filter(
//         (cartItem) =>
//           !(
//             cartItem.trainId === item.trainId &&
//             cartItem.seatNumber === item.seatNumber &&
//             cartItem.coachName === item.coachName
//           )
//       )
//     );
//     setSelectedSeatsByCoach((prev) => ({
//       ...prev,
//       [coachKey]: (prev[coachKey] || []).filter(
//         (seat) => seat !== item.seatNumber
//       ),
//     }));
//     if (cartItems.length === 1) setTimer(0);
//   };

//   // Clear all tickets from cart and revert pending seats
//   const clearCart = async () => {
//     for (const seatId of Object.keys(pendingSeats).map(Number)) {
//       const seatData = selectedCoach?.seatData.find((s) => s.seatId === seatId);
//       if (seatData) {
//         try {
//           await updateSeatMutation.mutateAsync({
//             id: seatData.seatId,
//             seatStatus: "available",
//             seatNumber: seatData.seatNumber,
//             seatType: seatData.seatType,
//             price: seatData.price,
//           });
//         } catch (error) {
//           console.error("Failed to revert seat to available:", error);
//         }
//       }
//     }
//     setCartItems([]);
//     setSelectedSeatsByCoach({});
//     setPendingSeats({});
//     setTimer(0);
//   };

//   // Timer countdown and revert pending seats on timeout
//   useEffect(() => {
//     if (cartItems.length === 0 || timer <= 0) {
//       if (timer <= 0 && Object.keys(pendingSeats).length > 0) {
//         // Revert all pending seats to available
//         const revertSeats = async () => {
//           for (const seatId of Object.keys(pendingSeats).map(Number)) {
//             const seatData = selectedCoach?.seatData.find(
//               (s) => s.seatId === seatId
//             );
//             if (seatData) {
//               try {
//                 await updateSeatMutation.mutateAsync({
//                   id: seatData.seatId,
//                   seatStatus: "available",
//                   seatNumber: seatData.seatNumber,
//                   seatType: seatData.seatType,
//                   price: seatData.price,
//                 });
//               } catch (error) {
//                 console.error("Failed to revert seat to available:", error);
//               }
//             }
//           }
//           setPendingSeats({});
//         };
//         revertSeats();
//       }
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           setCartItems([]);
//           setSelectedSeatsByCoach({});
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [cartItems, timer, pendingSeats, selectedCoach, updateSeatMutation]);

//   // Format time display
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   // Get current coach's selected seats
//   const getCurrentSelectedSeats = () => {
//     if (!selectedTrain || !selectedCoach) return [];
//     const coachKey = `${selectedTrain.id}-${selectedCoach.id}`;
//     return selectedSeatsByCoach[coachKey] || [];
//   };

//   // Format price in VND
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   if (isLoading) {
//     return (
//       <div>
//         <TrainTripSkeleton />
//       </div>
//     );
//   }

//   if (error) {
//     return <div>Error loading train trips: {(error as Error).message}</div>;
//   }

//   if (!departureStation || !arrivalStation || !departureDate) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="flex gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl w-full">
//           <div className="w-1/2 text-gray-700 text-base leading-relaxed">
//             Please provide all required search parameters (departure station,
//             arrival station, and departure date) to view available train trips.
//             Use the search form to select your journey details.
//           </div>
//           <div className="w-1/2">
//             <SearchTicket />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (trains.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="flex gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl w-full">
//           <div className="w-1/2 text-gray-700 text-base leading-relaxed">
//             <NoResults
//               departureStation={departureStation}
//               arrivalStation={arrivalStation}
//               departureDate={departureDate}
//             />
//           </div>
//           <div className="w-1/2">
//             <SearchTicket />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
//       <div className="col-span-3 border rounded-lg bg-white shadow-md p-4">
//         <div>
//           <h2 className="text-xl font-bold mb-4 text-center">Chọn tàu</h2>
//           <div className="grid grid-cols-5 gap-4">
//             {trains.map((train) => (
//               <Card
//                 key={train.trainTripId}
//                 className={`relative p-4 text-center cursor-pointer flex flex-col justify-center items-center h-[250px] w-[200px] bg-cover bg-center border-none ${
//                   selectedTrain?.id === train.id
//                     ? "bg-blue-500"
//                     : "bg-transparent"
//                 }`}
//                 style={{ backgroundImage: `url('/head-train3.png')` }}
//                 onClick={() => handleTrainSelect(train.id)}
//               >
//                 <div className="absolute inset-0"></div>
//                 <CardContent className="relative z-10 text-black top-[-32px]">
//                   <h3 className="text-lg font-bold p-1 w-fit inline-block">
//                     {train.name}
//                   </h3>
//                   <div className="flex justify-between items-center mt-5">
//                     <p className="text-sm whitespace-nowrap font-bold">
//                       TG đi :
//                     </p>
//                     <p className="whitespace-nowrap">{train.departure}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-sm whitespace-nowrap font-bold">
//                       TG đến :
//                     </p>
//                     <p className="whitespace-nowrap">{train.arrival}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs whitespace-nowrap">Chỗ Đặt</p>
//                     <p className="text-xs whitespace-nowrap">Chỗ Trống</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-lg font-bold whitespace-nowrap">
//                       {train.carriages.reduce(
//                         (sum, c) => sum + c.seats.length,
//                         0
//                       )}
//                     </p>
//                     <p className="text-lg font-bold whitespace-nowrap">
//                       {train.availableSeats}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {selectedTrain && (
//             <div className="flex items-center mt-3">
//               <Image
//                 src="/train-head1.png"
//                 width={60}
//                 height={30}
//                 quality={100}
//                 alt="Train Head"
//                 className="w-[65px] h-auto"
//               />
//               {selectedTrain.carriages.map((coach) => (
//                 <Card
//                   key={coach.id}
//                   className={`relative p-4 text-center cursor-pointer bg-cover bg-center h-[70px] w-[100px] ${
//                     selectedCoach?.id === coach.id ? "bg-blue-500" : ""
//                   }`}
//                   style={{ backgroundImage: `url('/carriage.png')` }}
//                   onClick={() => handleCoachSelect(coach.id)}
//                 >
//                   <h3 className="text-sm font-bold mt-3 text-white">
//                     {coach.id}
//                   </h3>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {selectedCoach && (
//             <div className="border-4 border-[#385d8a] p-4 mt-2 rounded-lg">
//               <h2 className="text-xl text-center font-bold mt-2 mb-3">
//                 Toa Số {selectedCoach.id} : {selectedCoach.name}
//               </h2>

//               {/* Seat type rendering */}
//               <div className="grid grid-cols-2 gap-4">
//                 {selectedCoach.type === "seat" &&
//                   Array.from(
//                     { length: selectedCoach.seats.length / 14 },
//                     (_, partIndex) => {
//                       const startIdx = partIndex * 14;
//                       return (
//                         <div
//                           key={partIndex}
//                           className="grid grid-cols-1 gap-2 border-x-4 border-blue-700 p-2 rounded-lg"
//                         >
//                           {Array.from({ length: 2 }, (_, rowIndex) => {
//                             const rowStart = startIdx + rowIndex * 7;
//                             return (
//                               <div
//                                 key={rowIndex}
//                                 className="grid grid-cols-7 gap-5"
//                               >
//                                 {Array.from({ length: 7 }, (_, colIndex) => {
//                                   const seat =
//                                     selectedCoach.seats[rowStart + colIndex];
//                                   if (!seat) return null;
//                                   const seatData = selectedCoach.seatData.find(
//                                     (s) => s.seatId === seat
//                                   );
//                                   const price = seatData
//                                     ? seatData.price
//                                     : selectedCoach.basePrice;
//                                   return (
//                                     <div key={seat} className="relative group">
//                                       <Card
//                                         className={`p-0 text-center cursor-pointer bg-cover bg-center h-[60px] w-[60px] flex items-center justify-center ${
//                                           selectedCoach.bookedSeats.includes(
//                                             seat
//                                           )
//                                             ? "bg-orange-600 text-white cursor-not-allowed"
//                                             : selectedCoach.pendingSeats.includes(
//                                                 seat
//                                               )
//                                             ? "bg-yellow-500 text-white cursor-not-allowed"
//                                             : getCurrentSelectedSeats().includes(
//                                                 seat
//                                               )
//                                             ? "bg-[#a6b727] text-white"
//                                             : "bg-transparent"
//                                         }`}
//                                         style={{
//                                           backgroundImage: `url('/seat.png')`,
//                                         }}
//                                         onClick={() =>
//                                           toggleSeatSelection(seat)
//                                         }
//                                       >
//                                         <h3 className="text-sm font-bold">
//                                           {seat}
//                                         </h3>
//                                       </Card>
//                                       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
//                                         {formatPrice(price)}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       );
//                     }
//                   )}
//               </div>

//               {/* 4-bed type rendering */}
//               <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-4">
//                 {selectedCoach.type === "4-bed" &&
//                   Array.from(
//                     { length: selectedCoach.seats.length / 4 },
//                     (_, i) => {
//                       const startIdx = i * 4;
//                       return (
//                         <div
//                           key={i}
//                           className="grid grid-rows-2 gap-2 text-center border-x-4 border-blue-700 p-2 rounded-lg"
//                         >
//                           {[0, 2].map((offset, rowIndex) => {
//                             const seatT1 =
//                               selectedCoach.seats[startIdx + offset];
//                             const seatT2 =
//                               selectedCoach.seats[startIdx + offset + 1];
//                             return (
//                               <div
//                                 key={seatT1}
//                                 className={`flex gap-2 ${
//                                   rowIndex === 0
//                                     ? "border-b-2 border-gray-500"
//                                     : ""
//                                 }`}
//                               >
//                                 {[seatT1, seatT2].map((seat) => {
//                                   const seatData = selectedCoach.seatData.find(
//                                     (s) => s.seatId === seat
//                                   );
//                                   const price = seatData
//                                     ? seatData.price
//                                     : selectedCoach.basePrice;
//                                   return (
//                                     <div key={seat} className="relative group">
//                                       <Card
//                                         className={`p-2 text-center cursor-pointer bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
//                                           selectedCoach.bookedSeats.includes(
//                                             seat
//                                           )
//                                             ? "bg-orange-600 text-white cursor-not-allowed"
//                                             : selectedCoach.pendingSeats.includes(
//                                                 seat
//                                               )
//                                             ? "bg-yellow-500 text-white cursor-not-allowed"
//                                             : getCurrentSelectedSeats().includes(
//                                                 seat
//                                               )
//                                             ? "bg-[#a6b727] text-white"
//                                             : "bg-transparent"
//                                         }`}
//                                         style={{
//                                           backgroundImage: `url('/bed.png')`,
//                                         }}
//                                         onClick={() =>
//                                           toggleSeatSelection(seat)
//                                         }
//                                       >
//                                         <h3 className="text-sm font-bold">
//                                           {seat}
//                                         </h3>
//                                       </Card>
//                                       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
//                                         {formatPrice(price)}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       );
//                     }
//                   )}
//               </div>

//               {/* 6-bed type rendering */}
//               <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-4">
//                 {selectedCoach.type === "6-bed" &&
//                   Array.from(
//                     { length: selectedCoach.seats.length / 6 },
//                     (_, i) => {
//                       const startIdx = i * 6;
//                       return (
//                         <div
//                           key={i}
//                           className="grid grid-rows-3 gap-2 text-center border-x-4 border-blue-700 p-1 rounded-lg"
//                         >
//                           {[0, 2, 4].map((offset, rowIndex) => {
//                             const seatT1 =
//                               selectedCoach.seats[startIdx + offset];
//                             const seatT2 =
//                               selectedCoach.seats[startIdx + offset + 1];
//                             return (
//                               <div
//                                 key={seatT1}
//                                 className={`flex gap-2 ${
//                                   rowIndex < 2
//                                     ? "border-b-2 border-gray-500 pb-2"
//                                     : ""
//                                 }`}
//                               >
//                                 {[seatT1, seatT2].map((seat) => {
//                                   const seatData = selectedCoach.seatData.find(
//                                     (s) => s.seatId === seat
//                                   );
//                                   const price = seatData
//                                     ? seatData.price
//                                     : selectedCoach.basePrice;
//                                   return (
//                                     <div key={seat} className="relative group">
//                                       <Card
//                                         className={`p-2 text-center cursor-pointer bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
//                                           selectedCoach.bookedSeats.includes(
//                                             seat
//                                           )
//                                             ? "bg-orange-600 text-white cursor-not-allowed"
//                                             : selectedCoach.pendingSeats.includes(
//                                                 seat
//                                               )
//                                             ? "bg-yellow-500 text-white cursor-not-allowed"
//                                             : getCurrentSelectedSeats().includes(
//                                                 seat
//                                               )
//                                             ? "bg-[#a6b727] text-white"
//                                             : "bg-transparent"
//                                         }`}
//                                         style={{
//                                           backgroundImage: `url('/bed.png')`,
//                                         }}
//                                         onClick={() =>
//                                           toggleSeatSelection(seat)
//                                         }
//                                       >
//                                         <h3 className="text-sm font-bold">
//                                           {seat}
//                                         </h3>
//                                       </Card>
//                                       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
//                                         {formatPrice(price)}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       );
//                     }
//                   )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="w-full">
//         <div className="w-full border rounded-lg w-72 bg-white shadow-md p-4">
//           <div className="flex justify-between items-center border-b pb-2 mb-2">
//             <div className="text-base font-semibold">Giỏ Vé</div>
//             {cartItems.length > 0 && (
//               <Button variant="destructive" size="sm" onClick={clearCart}>
//                 Xóa tất cả <Trash2 />
//               </Button>
//             )}
//           </div>
//           {cartItems.length > 0 ? (
//             <div className="flex flex-col space-y-3">
//               {cartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="border-b pb-2 flex justify-between items-start border rounded-lg p-2 bg-white shadow-md"
//                 >
//                   <div>
//                     <p className="font-semibold">{item.trainName}</p>
//                     <p className="text-sm">
//                       <span className="font-bold">Toa: {item.coachId} -</span>{" "}
//                       {item.coachName}
//                     </p>
//                     <div className="flex gap-2">
//                       <p className="text-sm">
//                         <span className="font-bold">Ghế:</span>{" "}
//                         {item.seatNumber} -
//                       </p>
//                       <p className="text-sm">
//                         <span className="font-bold">Giá:</span>{" "}
//                         <span className="text-red-500 font-bold text-md">
//                           {formatPrice(item.price)}
//                         </span>
//                       </p>
//                     </div>
//                     <div className="flex-row gap-2">
//                       <p className="text-sm">
//                         <span className="font-bold">Khởi hành:</span>{" "}
//                         {item.departure}
//                       </p>
//                       <p className="text-sm">
//                         <span className="font-bold">Đến:</span> {item.arrival}
//                       </p>
//                     </div>
//                   </div>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => removeTicket(item)}
//                   >
//                     <Trash2 />
//                   </Button>
//                 </div>
//               ))}
//               <div className="mt-2">
//                 <p className="text-sm font-bold">
//                   Thời gian giữ vé: {formatTime(timer)}
//                 </p>
//                 <Button
//                   className="mt-2 w-full"
//                   onClick={() => {
//                     const query = new URLSearchParams({
//                       tickets: JSON.stringify(cartItems),
//                       timer: timer.toString(),
//                     }).toString();
//                     router.push(`/payment?${query}`);
//                     setCartItems([]);
//                     setSelectedSeatsByCoach({});
//                     setPendingSeats({});
//                   }}
//                 >
//                   Xác nhận đặt vé
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <p className="text-sm text-gray-500">Chưa có vé nào trong giỏ</p>
//           )}
//         </div>
//         <div className="mt-5 w-full border rounded-lg w-72 bg-white shadow-md p-4">
//           <SearchTicket />
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import SearchTicket from "../search-ticket";
// import { Trash2 } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { format } from "date-fns";
// import trainTripApiRequest from "@/queries/useTrainTrip";
// import { useUpdateSeatMutation } from "@/queries/useSeat";
// import TrainTripSkeleton from "@/components/TrainTripSkeleton";
// import NoResults from "@/components/no-Result";

// // Define interfaces based on API schema
// interface Station {
//   stationId: number;
//   stationName: string;
//   position: number;
// }

// interface Train {
//   trainId: number;
//   trainName: string;
//   trainStatus: string;
//   carriages: Carriage[];
// }

// interface Route {
//   routeId: number;
//   originStation: Station;
//   journey: Station[];
// }

// interface Schedule {
//   scheduleId: number;
//   departure: {
//     clockTimeId: number;
//     date: string;
//     hour: number;
//     minute: number;
//   };
//   arrival: {
//     clockTimeId: number;
//     date: string;
//     hour: number;
//     minute: number;
//   };
// }

// interface Seat {
//   seatId: number;
//   seatNumber: number | null;
//   seatType: string;
//   seatStatus: string;
//   price: number;
// }

// interface Carriage {
//   carriageId: number;
//   carriageType: "fourBeds" | "sixBeds" | "seat";
//   price: number;
//   discount: number;
//   seats: Seat[];
// }

// interface FrontendCarriage {
//   id: number;
//   name: string;
//   type: "4-bed" | "6-bed" | "seat";
//   basePrice: number;
//   seats: number[];
//   bookedSeats: number[];
//   pendingSeats: number[];
//   discount: number;
//   seatData: Seat[];
// }

// interface FrontendTrain {
//   id: string;
//   name: string;
//   departure: string;
//   arrival: string;
//   departureStation: string; // New field
//   arrivalStation: string; // New field
//   availableSeats: number;
//   carriages: FrontendCarriage[];
//   trainTripId: number;
// }

// export type TrainTrip = {
//   trainTripId: number;
//   train: { trainId: number; trainName: string; trainStatus: string };
//   route: {
//     routeId: number;
//     originStation: { stationId: number; stationName: string; position: number };
//     journey: { stationId: number; stationName: string; position: number }[];
//   };
//   schedule: {
//     scheduleId: number;
//     departure: {
//       clockTimeId: number;
//       date: string;
//       hour: number;
//       minute: number;
//     };
//     arrival: {
//       clockTimeId: number;
//       date: string;
//       hour: number;
//       minute: number;
//     };
//   };
// };

// export interface SearchData {
//   departureStation: string | null;
//   arrivalStation: string | null;
//   tripType: string | null;
//   departureDate: string | null;
//   returnDate: string | null;
// }

// interface CartItem {
//   trainId: string;
//   trainName: string;
//   coachName: string;
//   coachId: number;
//   seatNumber: number;
//   departure: string;
//   arrival: string;
//   departureStation: string; // New field
//   arrivalStation: string; // New field
//   timestamp: number;
//   price: number;
// }

// // Validate date and time inputs
// const isValidDateString = (dateStr: string): boolean => {
//   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//   if (!dateRegex.test(dateStr)) return false;
//   const date = new Date(dateStr);
//   return !isNaN(date.getTime());
// };

// const isValidTime = (hour: number, minute: number): boolean => {
//   return (
//     Number.isInteger(hour) &&
//     hour >= 0 &&
//     hour <= 23 &&
//     Number.isInteger(minute) &&
//     minute >= 0 &&
//     minute <= 59
//   );
// };

// // Map API train trips to frontend format
// const mapTrainTripsToFrontend = (
//   trainTrips: TrainTrip[],
//   departureStation: string | null,
//   arrivalStation: string | null
// ): FrontendTrain[] => {
//   const fallbackDateTime = new Date();
//   return trainTrips
//     .filter((trip) => {
//       if (!trip.schedule) {
//         console.warn(`TrainTrip ${trip.trainTripId} is missing schedule data`);
//         return false;
//       }
//       const { departure, arrival } = trip.schedule;
//       if (
//         !isValidDateString(departure.date.split("T")[0]) ||
//         !isValidDateString(arrival.date.split("T")[0]) ||
//         !isValidTime(departure.hour, departure.minute) ||
//         !isValidTime(arrival.hour, arrival.minute)
//       ) {
//         console.warn(`TrainTrip ${trip.trainTripId} has invalid schedule data`);
//         return false;
//       }
//       return true;
//     })
//     .map((trip) => {
//       const carriages = trip.train.carriages
//         .filter((carriage) => carriage.seats.length > 0)
//         .map((carriage) => {
//           const maxSeats =
//             carriage.carriageType === "fourBeds"
//               ? 28
//               : carriage.carriageType === "sixBeds"
//               ? 42
//               : 56;
//           const limitedSeats = carriage.seats.slice(0, maxSeats);

//           return {
//             id: carriage.carriageId,
//             name: `Carriage ${carriage.carriageId}`,
//             type:
//               carriage.carriageType === "fourBeds"
//                 ? "4-bed"
//                 : carriage.carriageType === "sixBeds"
//                 ? "6-bed"
//                 : "seat",
//             basePrice: carriage.price,
//             seats: limitedSeats.map((seat) => seat.seatId),
//             bookedSeats: limitedSeats
//               .filter((seat) => seat.seatStatus === "booked")
//               .map((seat) => seat.seatId),
//             pendingSeats: limitedSeats
//               .filter((seat) => seat.seatStatus === "pending")
//               .map((seat) => seat.seatId),
//             discount: carriage.discount,
//             seatData: limitedSeats,
//           };
//         });

//       const totalAvailableSeats = carriages.reduce(
//         (sum, carriage) =>
//           sum +
//           (carriage.seats.length -
//             carriage.bookedSeats.length -
//             carriage.pendingSeats.length),
//         0
//       );

//       const departureDateTime = new Date(trip.schedule.departure.date);
//       const arrivalDateTime = new Date(trip.schedule.arrival.date);

//       return {
//         id: `${trip.train.trainName}-${trip.trainTripId}`,
//         name: trip.train.trainName,
//         departure: !isNaN(departureDateTime.getTime())
//           ? format(departureDateTime, "dd/MM HH:mm")
//           : format(fallbackDateTime, "dd/MM HH:mm"),
//         arrival: !isNaN(arrivalDateTime.getTime())
//           ? format(arrivalDateTime, "dd/MM HH:mm")
//           : format(fallbackDateTime, "dd/MM HH:mm"),
//         departureStation: departureStation || "Unknown",
//         arrivalStation: arrivalStation || "Unknown",
//         availableSeats: totalAvailableSeats,
//         carriages,
//         trainTripId: trip.trainTripId,
//       };
//     });
// };

// // Filter train trips based on search parameters
// const filterTrainTrips = (
//   trainTrips: TrainTrip[],
//   departureStation: string | null,
//   arrivalStation: string | null,
//   departureDate: string | null,
//   tripType: string | null,
//   returnDate: string | null
// ): TrainTrip[] => {
//   if (!departureStation || !arrivalStation || !departureDate) {
//     console.log("Missing required parameters:", {
//       departureStation,
//       arrivalStation,
//       departureDate,
//     });
//     return [];
//   }

//   return trainTrips.filter((trip) => {
//     const allStations = [trip.route.originStation, ...trip.route.journey].map(
//       (station) => station.stationName.toLowerCase()
//     );
//     const departureIndex = allStations.indexOf(departureStation.toLowerCase());
//     const arrivalIndex = allStations.indexOf(arrivalStation.toLowerCase());

//     // Ensure both stations are found and departure comes before arrival
//     const stationMatch =
//       departureIndex !== -1 &&
//       arrivalIndex !== -1 &&
//       departureIndex < arrivalIndex;

//     // Date matching
//     const dateMatch =
//       trip.schedule?.departure.date.split("T")[0] ===
//       new Date(departureDate).toISOString().split("T")[0];

//     // Round-trip logic (placeholder for now)
//     let returnMatch = true;
//     if (tripType === "round-trip" && returnDate) {
//       // TODO: Implement round-trip filtering logic
//       returnMatch = true;
//     }

//     return stationMatch && dateMatch && returnMatch;
//   });
// };

// export default function Search() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [selectedTrain, setSelectedTrain] = useState<FrontendTrain | null>(
//     null
//   );
//   const [selectedCoach, setSelectedCoach] = useState<FrontendCarriage | null>(
//     null
//   );
//   const [selectedSeatsByCoach, setSelectedSeatsByCoach] = useState<
//     Record<string, number[]>
//   >({});
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [timer, setTimer] = useState(600);
//   const [pendingSeats, setPendingSeats] = useState<Record<number, number>>({});

//   // Extract search parameters
//   const departureStation = searchParams.get("departureStation");
//   const arrivalStation = searchParams.get("arrivalStation");
//   const departureDate = searchParams.get("departureDate");
//   const tripType = searchParams.get("tripType");
//   const returnDate = searchParams.get("returnDate");

//   // Fetch train trips
//   const {
//     data: trainTripsData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: [
//       "trainTrips",
//       departureStation,
//       arrivalStation,
//       departureDate,
//       tripType,
//       returnDate,
//     ],
//     queryFn: () =>
//       trainTripApiRequest.list(1, 20, {
//         departureStation: departureStation || undefined,
//         arrivalStation: arrivalStation || undefined,
//         departureDate: departureDate || undefined,
//       }),
//     select: (response) => response.payload.data.result,
//     enabled: !!departureStation && !!arrivalStation && !!departureDate,
//   });

//   // Map train trips to frontend format
//   const trains = trainTripsData
//     ? mapTrainTripsToFrontend(
//         filterTrainTrips(
//           trainTripsData,
//           departureStation,
//           arrivalStation,
//           departureDate,
//           tripType,
//           returnDate
//         ),
//         departureStation,
//         arrivalStation
//       )
//     : [];

//   // Use mutation for updating seat status
//   const updateSeatMutation = useUpdateSeatMutation();

//   // Handle train selection
//   const handleTrainSelect = (trainId: string) => {
//     const train = trains.find((t) => t.id === trainId) || null;
//     setSelectedTrain(train);
//     setSelectedCoach(null);
//   };

//   // Handle coach selection
//   const handleCoachSelect = (coachId: number) => {
//     if (!selectedTrain) return;
//     const coach = selectedTrain.carriages.find((c) => c.id === coachId) || null;
//     setSelectedCoach(coach);
//   };

//   const MAX_TICKETS = 10;

//   // Handle seat selection and add to cart
//   const toggleSeatSelection = async (seat: number) => {
//     if (!selectedCoach || !selectedTrain) return;
//     if (
//       selectedCoach.bookedSeats.includes(seat) ||
//       selectedCoach.pendingSeats.includes(seat)
//     )
//       return;

//     const coachKey = `${selectedTrain.id}-${selectedCoach.id}`;
//     const currentSeats = selectedSeatsByCoach[coachKey] || [];
//     const newSelectedSeats = currentSeats.includes(seat)
//       ? currentSeats.filter((s) => s !== seat)
//       : [...currentSeats, seat];
//     const isDeselecting = currentSeats.includes(seat);

//     if (!isDeselecting && cartItems.length >= MAX_TICKETS) {
//       alert(`Bạn chỉ có thể đặt tối đa ${MAX_TICKETS} vé trong một lần đặt!`);
//       return;
//     }

//     if (!isDeselecting) {
//       // Update seat status to pending in the backend
//       const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
//       if (seatData) {
//         try {
//           await updateSeatMutation.mutateAsync({
//             id: seatData.seatId,
//             seatNumber: seatData.seatNumber,
//             seatType: seatData.seatType,
//             price: seatData.price,
//           });
//           setPendingSeats((prev) => ({
//             ...prev,
//             [seatData.seatId]: Date.now(),
//           }));
//         } catch (error) {
//           console.error("Failed to update seat status to pending:", error);
//           return;
//         }
//       }
//     }

//     setSelectedSeatsByCoach((prev) => ({
//       ...prev,
//       [coachKey]: newSelectedSeats,
//     }));

//     if (!currentSeats.includes(seat)) {
//       const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
//       const price = seatData ? seatData.price : selectedCoach.basePrice;
//       const newCartItem: CartItem = {
//         trainId: selectedTrain.id,
//         trainName: selectedTrain.name,
//         coachName: selectedCoach.name,
//         seatNumber: seat,
//         departure: selectedTrain.departure,
//         arrival: selectedTrain.arrival,
//         departureStation: selectedTrain.departureStation,
//         arrivalStation: selectedTrain.arrivalStation,
//         timestamp: Date.now(),
//         price,
//       };
//       setCartItems((prev) => [...prev, newCartItem]);
//       setTimer(600);
//     } else {
//       // If deselecting, revert seat to available
//       const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
//       if (seatData) {
//         try {
//           await updateSeatMutation.mutateAsync({
//             id: seatData.seatId,
//             seatStatus: "available",
//             seatNumber: seatData.seatNumber,
//             seatType: seatData.seatType,
//             price: seatData.price,
//           });
//           setPendingSeats((prev) => {
//             const newPending = { ...prev };
//             delete newPending[seatData.seatId];
//             return newPending;
//           });
//         } catch (error) {
//           console.error("Failed to revert seat to available:", error);
//         }
//       }
//       setCartItems((prev) =>
//         prev.filter(
//           (item) =>
//             !(
//               item.trainId === selectedTrain.id &&
//               item.seatNumber === seat &&
//               item.coachName === selectedCoach.name
//             )
//         )
//       );
//     }
//   };

//   // Remove individual ticket from cart
//   const removeTicket = async (item: CartItem) => {
//     const coachKey = `${item.trainId}-${item.coachId}`;
//     const seatData = selectedCoach?.seatData.find(
//       (s) => s.seatId === item.seatNumber
//     );
//     if (seatData) {
//       try {
//         await updateSeatMutation.mutateAsync({
//           id: seatData.seatId,
//           seatStatus: "available",
//           seatNumber: seatData.seatNumber,
//           seatType: seatData.seatType,
//           price: seatData.price,
//         });
//         setPendingSeats((prev) => {
//           const newPending = { ...prev };
//           delete newPending[seatData.seatId];
//           return newPending;
//         });
//       } catch (error) {
//         console.error("Failed to revert seat to available:", error);
//       }
//     }
//     setCartItems((prev) =>
//       prev.filter(
//         (cartItem) =>
//           !(
//             cartItem.trainId === item.trainId &&
//             cartItem.seatNumber === item.seatNumber &&
//             cartItem.coachName === item.coachName
//           )
//       )
//     );
//     setSelectedSeatsByCoach((prev) => ({
//       ...prev,
//       [coachKey]: (prev[coachKey] || []).filter(
//         (seat) => seat !== item.seatNumber
//       ),
//     }));
//     if (cartItems.length === 1) setTimer(0);
//   };

//   // Clear all tickets from cart and revert pending seats
//   const clearCart = async () => {
//     for (const seatId of Object.keys(pendingSeats).map(Number)) {
//       const seatData = selectedCoach?.seatData.find((s) => s.seatId === seatId);
//       if (seatData) {
//         try {
//           await updateSeatMutation.mutateAsync({
//             id: seatData.seatId,
//             seatStatus: "available",
//             seatNumber: seatData.seatNumber,
//             seatType: seatData.seatType,
//             price: seatData.price,
//           });
//         } catch (error) {
//           console.error("Failed to revert seat to available:", error);
//         }
//       }
//     }
//     setCartItems([]);
//     setSelectedSeatsByCoach({});
//     setPendingSeats({});
//     setTimer(0);
//   };

//   // Timer countdown and revert pending seats on timeout
//   useEffect(() => {
//     if (cartItems.length === 0 || timer <= 0) {
//       if (timer <= 0 && Object.keys(pendingSeats).length > 0) {
//         const revertSeats = async () => {
//           for (const seatId of Object.keys(pendingSeats).map(Number)) {
//             const seatData = selectedCoach?.seatData.find(
//               (s) => s.seatId === seatId
//             );
//             if (seatData) {
//               try {
//                 await updateSeatMutation.mutateAsync({
//                   id: seatData.seatId,
//                   seatStatus: "available",
//                   seatNumber: seatData.seatNumber,
//                   seatType: seatData.seatType,
//                   price: seatData.price,
//                 });
//               } catch (error) {
//                 console.error("Failed to revert seat to available:", error);
//               }
//             }
//           }
//           setPendingSeats({});
//         };
//         revertSeats();
//       }
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           setCartItems([]);
//           setSelectedSeatsByCoach({});
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [cartItems, timer, pendingSeats, selectedCoach, updateSeatMutation]);

//   // Format time display
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   // Get current coach's selected seats
//   const getCurrentSelectedSeats = () => {
//     if (!selectedTrain || !selectedCoach) return [];
//     const coachKey = `${selectedTrain.id}-${selectedCoach.id}`;
//     return selectedSeatsByCoach[coachKey] || [];
//   };

//   // Format price in VND
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   if (isLoading) {
//     return (
//       <div>
//         <TrainTripSkeleton />
//       </div>
//     );
//   }

//   if (error) {
//     return <div>Error loading train trips: {(error as Error).message}</div>;
//   }

//   if (!departureStation || !arrivalStation || !departureDate) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="flex gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl w-full">
//           <div className="w-1/2 text-gray-700 text-base leading-relaxed">
//             Please provide all required search parameters (departure station,
//             arrival station, and departure date) to view available train trips.
//             Use the search form to select your journey details.
//           </div>
//           <div className="w-1/2">
//             <SearchTicket />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (trains.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="flex gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl w-full">
//           <div className="w-1/2 text-gray-700 text-base leading-relaxed">
//             <NoResults
//               departureStation={departureStation}
//               arrivalStation={arrivalStation}
//               departureDate={departureDate}
//             />
//           </div>
//           <div className="w-1/2">
//             <SearchTicket />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
//       <div className="col-span-3 border rounded-lg bg-white shadow-md p-4">
//         <div>
//           <h2 className="text-xl font-bold mb-4 text-center">Chọn tàu</h2>
//           <div className="grid grid-cols-5 gap-4">
//             {trains.map((train) => (
//               <Card
//                 key={train.trainTripId}
//                 className={`relative p-4 text-center cursor-pointer flex flex-col justify-center items-center h-[250px] w-[200px] bg-cover bg-center border-none ${
//                   selectedTrain?.id === train.id
//                     ? "bg-blue-500"
//                     : "bg-transparent"
//                 }`}
//                 style={{ backgroundImage: `url('/head-train3.png')` }}
//                 onClick={() => handleTrainSelect(train.id)}
//               >
//                 <div className="absolute inset-0"></div>
//                 <CardContent className="relative z-10 text-black top-[-32px]">
//                   <h3 className="text-lg font-bold p-1 w-fit inline-block">
//                     {train.name}
//                   </h3>
//                   <div className="flex justify-between items-center mt-5">
//                     <p className="text-sm whitespace-nowrap font-bold">
//                       Ga đi:
//                     </p>
//                     <p className="whitespace-nowrap">
//                       {train.departureStation}
//                     </p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-sm whitespace-nowrap font-bold">
//                       Ga đến:
//                     </p>
//                     <p className="whitespace-nowrap">{train.arrivalStation}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-sm whitespace-nowrap font-bold">
//                       TG đi:
//                     </p>
//                     <p className="whitespace-nowrap">{train.departure}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-sm whitespace-nowrap font-bold">
//                       TG đến:
//                     </p>
//                     <p className="whitespace-nowrap">{train.arrival}</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-xs whitespace-nowrap">Chỗ Đặt</p>
//                     <p className="text-xs whitespace-nowrap">Chỗ Trống</p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-lg font-bold whitespace-nowrap">
//                       {train.carriages.reduce(
//                         (sum, c) => sum + c.seats.length,
//                         0
//                       )}
//                     </p>
//                     <p className="text-lg font-bold whitespace-nowrap">
//                       {train.availableSeats}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {selectedTrain && (
//             <div className="flex items-center mt-3">
//               <Image
//                 src="/train-head1.png"
//                 width={60}
//                 height={30}
//                 quality={100}
//                 alt="Train Head"
//                 className="w-[65px] h-auto"
//               />
//               {selectedTrain.carriages.map((coach) => (
//                 <Card
//                   key={coach.id}
//                   className={`relative p-4 text-center cursor-pointer bg-cover bg-center h-[70px] w-[100px] ${
//                     selectedCoach?.id === coach.id ? "bg-blue-500" : ""
//                   }`}
//                   style={{ backgroundImage: `url('/carriage.png')` }}
//                   onClick={() => handleCoachSelect(coach.id)}
//                 >
//                   <h3 className="text-sm font-bold mt-3 text-white">
//                     {coach.id}
//                   </h3>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {selectedCoach && (
//             <div className="border-4 border-[#385d8a] p-4 mt-2 rounded-lg">
//               <h2 className="text-xl text-center font-bold mt-2 mb-3">
//                 Toa Số {selectedCoach.id} : {selectedCoach.name}
//               </h2>

//               {/* Seat type rendering */}
//               <div className="grid grid-cols-2 gap-4">
//                 {selectedCoach.type === "seat" &&
//                   Array.from(
//                     { length: selectedCoach.seats.length / 14 },
//                     (_, partIndex) => {
//                       const startIdx = partIndex * 14;
//                       return (
//                         <div
//                           key={partIndex}
//                           className="grid grid-cols-1 gap-2 border-x-4 border-blue-700 p-2 rounded-lg"
//                         >
//                           {Array.from({ length: 2 }, (_, rowIndex) => {
//                             const rowStart = startIdx + rowIndex * 7;
//                             return (
//                               <div
//                                 key={rowIndex}
//                                 className="grid grid-cols-7 gap-5"
//                               >
//                                 {Array.from({ length: 7 }, (_, colIndex) => {
//                                   const seat =
//                                     selectedCoach.seats[rowStart + colIndex];
//                                   if (!seat) return null;
//                                   const seatData = selectedCoach.seatData.find(
//                                     (s) => s.seatId === seat
//                                   );
//                                   const price = seatData
//                                     ? seatData.price
//                                     : selectedCoach.basePrice;
//                                   return (
//                                     <div key={seat} className="relative group">
//                                       <Card
//                                         className={`p-0 text-center cursor-pointer bg-cover bg-center h-[60px] w-[60px] flex items-center justify-center ${
//                                           selectedCoach.bookedSeats.includes(
//                                             seat
//                                           )
//                                             ? "bg-orange-600 text-white cursor-not-allowed"
//                                             : selectedCoach.pendingSeats.includes(
//                                                 seat
//                                               )
//                                             ? "bg-yellow-500 text-white cursor-not-allowed"
//                                             : getCurrentSelectedSeats().includes(
//                                                 seat
//                                               )
//                                             ? "bg-[#a6b727] text-white"
//                                             : "bg-transparent"
//                                         }`}
//                                         style={{
//                                           backgroundImage: `url('/seat.png')`,
//                                         }}
//                                         onClick={() =>
//                                           toggleSeatSelection(seat)
//                                         }
//                                       >
//                                         <h3 className="text-sm font-bold">
//                                           {seat}
//                                         </h3>
//                                       </Card>
//                                       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
//                                         {formatPrice(price)}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       );
//                     }
//                   )}
//               </div>

//               {/* 4-bed type rendering */}
//               <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-4">
//                 {selectedCoach.type === "4-bed" &&
//                   Array.from(
//                     { length: selectedCoach.seats.length / 4 },
//                     (_, i) => {
//                       const startIdx = i * 4;
//                       return (
//                         <div
//                           key={i}
//                           className="grid grid-rows-2 gap-2 text-center border-x-4 border-blue-700 p-2 rounded-lg"
//                         >
//                           {[0, 2].map((offset, rowIndex) => {
//                             const seatT1 =
//                               selectedCoach.seats[startIdx + offset];
//                             const seatT2 =
//                               selectedCoach.seats[startIdx + offset + 1];
//                             return (
//                               <div
//                                 key={seatT1}
//                                 className={`flex gap-2 ${
//                                   rowIndex === 0
//                                     ? "border-b-2 border-gray-500"
//                                     : ""
//                                 }`}
//                               >
//                                 {[seatT1, seatT2].map((seat) => {
//                                   const seatData = selectedCoach.seatData.find(
//                                     (s) => s.seatId === seat
//                                   );
//                                   const price = seatData
//                                     ? seatData.price
//                                     : selectedCoach.basePrice;
//                                   return (
//                                     <div key={seat} className="relative group">
//                                       <Card
//                                         className={`p-2 text-center cursor-pointer bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
//                                           selectedCoach.bookedSeats.includes(
//                                             seat
//                                           )
//                                             ? "bg-orange-600 text-white cursor-not-allowed"
//                                             : selectedCoach.pendingSeats.includes(
//                                                 seat
//                                               )
//                                             ? "bg-yellow-500 text-white cursor-not-allowed"
//                                             : getCurrentSelectedSeats().includes(
//                                                 seat
//                                               )
//                                             ? "bg-[#a6b727] text-white"
//                                             : "bg-transparent"
//                                         }`}
//                                         style={{
//                                           backgroundImage: `url('/bed.png')`,
//                                         }}
//                                         onClick={() =>
//                                           toggleSeatSelection(seat)
//                                         }
//                                       >
//                                         <h3 className="text-sm font-bold">
//                                           {seat}
//                                         </h3>
//                                       </Card>
//                                       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
//                                         {formatPrice(price)}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       );
//                     }
//                   )}
//               </div>

//               {/* 6-bed type rendering */}
//               <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-4">
//                 {selectedCoach.type === "6-bed" &&
//                   Array.from(
//                     { length: selectedCoach.seats.length / 6 },
//                     (_, i) => {
//                       const startIdx = i * 6;
//                       return (
//                         <div
//                           key={i}
//                           className="grid grid-rows-3 gap-2 text-center border-x-4 border-blue-700 p-1 rounded-lg"
//                         >
//                           {[0, 2, 4].map((offset, rowIndex) => {
//                             const seatT1 =
//                               selectedCoach.seats[startIdx + offset];
//                             const seatT2 =
//                               selectedCoach.seats[startIdx + offset + 1];
//                             return (
//                               <div
//                                 key={seatT1}
//                                 className={`flex gap-2 ${
//                                   rowIndex < 2
//                                     ? "border-b-2 border-gray-500 pb-2"
//                                     : ""
//                                 }`}
//                               >
//                                 {[seatT1, seatT2].map((seat) => {
//                                   const seatData = selectedCoach.seatData.find(
//                                     (s) => s.seatId === seat
//                                   );
//                                   const price = seatData
//                                     ? seatData.price
//                                     : selectedCoach.basePrice;
//                                   return (
//                                     <div key={seat} className="relative group">
//                                       <Card
//                                         className={`p-2 text-center cursor-pointer bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
//                                           selectedCoach.bookedSeats.includes(
//                                             seat
//                                           )
//                                             ? "bg-orange-600 text-white cursor-not-allowed"
//                                             : selectedCoach.pendingSeats.includes(
//                                                 seat
//                                               )
//                                             ? "bg-yellow-500 text-white cursor-not-allowed"
//                                             : getCurrentSelectedSeats().includes(
//                                                 seat
//                                               )
//                                             ? "bg-[#a6b727] text-white"
//                                             : "bg-transparent"
//                                         }`}
//                                         style={{
//                                           backgroundImage: `url('/bed.png')`,
//                                         }}
//                                         onClick={() =>
//                                           toggleSeatSelection(seat)
//                                         }
//                                       >
//                                         <h3 className="text-sm font-bold">
//                                           {seat}
//                                         </h3>
//                                       </Card>
//                                       <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
//                                         {formatPrice(price)}
//                                       </div>
//                                     </div>
//                                   );
//                                 })}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       );
//                     }
//                   )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="w-full">
//         <div className="w-full border rounded-lg w-72 bg-white shadow-md p-4">
//           <div className="flex justify-between items-center border-b pb-2 mb-2">
//             <div className="text-base font-semibold">Giỏ Vé</div>
//             {cartItems.length > 0 && (
//               <Button variant="destructive" size="sm" onClick={clearCart}>
//                 Xóa tất cả <Trash2 />
//               </Button>
//             )}
//           </div>
//           {cartItems.length > 0 ? (
//             <div className="flex flex-col space-y-3">
//               {cartItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="border-b pb-2 flex justify-between items-start border rounded-lg p-2 bg-white shadow-md"
//                 >
//                   <div>
//                     <p className="font-semibold">{item.trainName}</p>
//                     <p className="text-sm">
//                       <span className="font-bold">Toa: {item.coachId} -</span>{" "}
//                       {item.coachName}
//                     </p>
//                     <div className="flex gap-2">
//                       <p className="text-sm">
//                         <span className="font-bold">Ghế:</span>{" "}
//                         {item.seatNumber} -
//                       </p>
//                       <p className="text-sm">
//                         <span className="font-bold">Giá:</span>{" "}
//                         <span className="text-red-500 font-bold text-md">
//                           {formatPrice(item.price)}
//                         </span>
//                       </p>
//                     </div>
//                     <div className="flex-row gap-2">
//                       <p className="text-sm">
//                         <span className="font-bold">Ga đi:</span>{" "}
//                         {item.departureStation}
//                       </p>
//                       <p className="text-sm">
//                         <span className="font-bold">Ga đến:</span>{" "}
//                         {item.arrivalStation}
//                       </p>
//                       <p className="text-sm">
//                         <span className="font-bold">Khởi hành:</span>{" "}
//                         {item.departure}
//                       </p>
//                       <p className="text-sm">
//                         <span className="font-bold">Đến:</span> {item.arrival}
//                       </p>
//                     </div>
//                   </div>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => removeTicket(item)}
//                   >
//                     <Trash2 />
//                   </Button>
//                 </div>
//               ))}
//               <div className="mt-2">
//                 <p className="text-sm font-bold">
//                   Thời gian giữ vé: {formatTime(timer)}
//                 </p>
//                 <Button
//                   className="mt-2 w-full"
//                   onClick={() => {
//                     const query = new URLSearchParams({
//                       tickets: JSON.stringify(cartItems),
//                       timer: timer.toString(),
//                     }).toString();
//                     router.push(`/payment?${query}`);
//                     setCartItems([]);
//                     setSelectedSeatsByCoach({});
//                     setPendingSeats({});
//                   }}
//                 >
//                   Xác nhận đặt vé
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <p className="text-sm text-gray-500">Chưa có vé nào trong giỏ</p>
//           )}
//         </div>
//         <div className="mt-5 w-full border rounded-lg w-72 bg-white shadow-md p-4">
//           <SearchTicket />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SearchTicket from "../search-ticket";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import trainTripApiRequest from "@/queries/useTrainTrip";
import { useUpdateSeatMutation } from "@/queries/useSeat";
import TrainTripSkeleton from "@/components/TrainTripSkeleton";
import NoResults from "@/components/no-Result";

// Define interfaces based on API schema
interface Station {
  stationId: number;
  stationName: string;
  position: number;
}

interface Train {
  trainId: number;
  trainName: string;
  trainStatus: string;
  carriages: Carriage[];
}

interface Route {
  routeId: number;
  originStation: Station;
  journey: Station[];
}

interface Schedule {
  scheduleId: number;
  departure: {
    clockTimeId: number;
    date: string;
    hour: number;
    minute: number;
  };
  arrival: {
    clockTimeId: number;
    date: string;
    hour: number;
    minute: number;
  };
}

interface Seat {
  seatId: number;
  seatNumber: number | null;
  seatType: string;
  seatStatus: string;
  price: number;
}

interface Carriage {
  carriageId: number;
  carriageType: "fourBeds" | "sixBeds" | "seat";
  price: number;
  discount: number;
  seats: Seat[];
}

interface FrontendCarriage {
  id: number;
  name: string;
  type: "4-bed" | "6-bed" | "seat";
  basePrice: number;
  seats: number[];
  bookedSeats: number[];
  pendingSeats: number[];
  discount: number;
  seatData: Seat[];
}

interface FrontendTrain {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  departureStation: string;
  departureStationId: number;
  arrivalStation: string;
  arrivalStationId: number;
  availableSeats: number;
  carriages: FrontendCarriage[];
  trainTripId: number;
}

export type TrainTrip = {
  trainTripId: number;
  train: { trainId: number; trainName: string; trainStatus: string };
  route: {
    routeId: number;
    originStation: { stationId: number; stationName: string; position: number };
    journey: { stationId: number; stationName: string; position: number }[];
  };
  schedule: {
    scheduleId: number;
    departure: {
      clockTimeId: number;
      date: string;
      hour: number;
      minute: number;
    };
    arrival: {
      clockTimeId: number;
      date: string;
      hour: number;
      minute: number;
    };
  };
};

export interface SearchData {
  departureStation: string | null;
  arrivalStation: string | null;
  tripType: string | null;
  departureDate: string | null;
  returnDate: string | null;
}

interface CartItem {
  trainId: string;
  trainName: string;
  trainTripId: number;
  coachName: string;
  coachId: number;
  seatNumber: number;
  departure: string;
  arrival: string;
  departureStation: string;
  departureStationId: number;
  arrivalStation: string;
  arrivalStationId: number;
  timestamp: number;
  price: number;
}

// Validate date and time inputs
const isValidDateString = (dateStr: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

const isValidTime = (hour: number, minute: number): boolean => {
  return (
    Number.isInteger(hour) &&
    hour >= 0 &&
    hour <= 23 &&
    Number.isInteger(minute) &&
    minute >= 0 &&
    minute <= 59
  );
};

// Map API train trips to frontend format
const mapTrainTripsToFrontend = (
  trainTrips: TrainTrip[],
  departureStation: string | null,
  arrivalStation: string | null
): FrontendTrain[] => {
  const fallbackDateTime = new Date();
  return trainTrips
    .filter((trip) => {
      if (!trip.schedule) {
        console.warn(`TrainTrip ${trip.trainTripId} is missing schedule data`);
        return false;
      }
      const { departure, arrival } = trip.schedule;
      if (
        !isValidDateString(departure.date.split("T")[0]) ||
        !isValidDateString(arrival.date.split("T")[0]) ||
        !isValidTime(departure.hour, departure.minute) ||
        !isValidTime(arrival.hour, arrival.minute)
      ) {
        console.warn(`TrainTrip ${trip.trainTripId} has invalid schedule data`);
        return false;
      }
      return true;
    })
    .map((trip) => {
      const carriages = trip.train.carriages
        .filter((carriage) => carriage.seats.length > 0)
        .map((carriage) => {
          const maxSeats =
            carriage.carriageType === "fourBeds"
              ? 28
              : carriage.carriageType === "sixBeds"
              ? 42
              : 56;
          const limitedSeats = carriage.seats.slice(0, maxSeats);

          return {
            id: carriage.carriageId,
            name: `Carriage ${carriage.carriageId}`,
            type:
              carriage.carriageType === "fourBeds"
                ? "4-bed"
                : carriage.carriageType === "sixBeds"
                ? "6-bed"
                : "seat",
            basePrice: carriage.price,
            seats: limitedSeats.map((seat) => seat.seatId),
            bookedSeats: limitedSeats
              .filter((seat) => seat.seatStatus === "booked")
              .map((seat) => seat.seatId),
            pendingSeats: limitedSeats
              .filter((seat) => seat.seatStatus === "pending")
              .map((seat) => seat.seatId),
            discount: carriage.discount,
            seatData: limitedSeats,
          };
        });

      const totalAvailableSeats = carriages.reduce(
        (sum, carriage) =>
          sum +
          (carriage.seats.length -
            carriage.bookedSeats.length -
            carriage.pendingSeats.length),
        0
      );

      const departureDateTime = new Date(trip.schedule.departure.date);
      const arrivalDateTime = new Date(trip.schedule.arrival.date);

      // Find station IDs based on station names
      const allStations = [trip.route.originStation, ...trip.route.journey];
      const departureStationData = allStations.find(
        (station) =>
          station.stationName.toLowerCase() === departureStation?.toLowerCase()
      );
      const arrivalStationData = allStations.find(
        (station) =>
          station.stationName.toLowerCase() === arrivalStation?.toLowerCase()
      );

      return {
        id: `${trip.train.trainName}-${trip.trainTripId}`,
        name: trip.train.trainName,
        departure: !isNaN(departureDateTime.getTime())
          ? format(departureDateTime, "dd/MM HH:mm")
          : format(fallbackDateTime, "dd/MM HH:mm"),
        arrival: !isNaN(arrivalDateTime.getTime())
          ? format(arrivalDateTime, "dd/MM HH:mm")
          : format(fallbackDateTime, "dd/MM HH:mm"),
        departureStation: departureStation || "Unknown",
        departureStationId: departureStationData?.stationId || 0,
        arrivalStation: arrivalStation || "Unknown",
        arrivalStationId: arrivalStationData?.stationId || 0,
        availableSeats: totalAvailableSeats,
        carriages,
        trainTripId: trip.trainTripId,
      };
    });
};

// Filter train trips based on search parameters
const filterTrainTrips = (
  trainTrips: TrainTrip[],
  departureStation: string | null,
  arrivalStation: string | null,
  departureDate: string | null,
  tripType: string | null,
  returnDate: string | null
): TrainTrip[] => {
  if (!departureStation || !arrivalStation || !departureDate) {
    console.log("Missing required parameters:", {
      departureStation,
      arrivalStation,
      departureDate,
    });
    return [];
  }

  return trainTrips.filter((trip) => {
    const allStations = [trip.route.originStation, ...trip.route.journey].map(
      (station) => station.stationName.toLowerCase()
    );
    const departureIndex = allStations.indexOf(departureStation.toLowerCase());
    const arrivalIndex = allStations.indexOf(arrivalStation.toLowerCase());

    // Ensure both stations are found and departure comes before arrival
    const stationMatch =
      departureIndex !== -1 &&
      arrivalIndex !== -1 &&
      departureIndex < arrivalIndex;

    // Date matching
    const dateMatch =
      trip.schedule?.departure.date.split("T")[0] ===
      new Date(departureDate).toISOString().split("T")[0];

    // Round-trip logic (placeholder for now)
    let returnMatch = true;
    if (tripType === "round-trip" && returnDate) {
      // TODO: Implement round-trip filtering logic
      returnMatch = true;
    }

    return stationMatch && dateMatch && returnMatch;
  });
};

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTrain, setSelectedTrain] = useState<FrontendTrain | null>(
    null
  );
  const [selectedCoach, setSelectedCoach] = useState<FrontendCarriage | null>(
    null
  );
  const [selectedSeatsByCoach, setSelectedSeatsByCoach] = useState<
    Record<string, number[]>
  >({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [timer, setTimer] = useState(600);
  const [pendingSeats, setPendingSeats] = useState<Record<number, number>>({});

  // Extract search parameters
  const departureStation = searchParams.get("departureStation");
  const arrivalStation = searchParams.get("arrivalStation");
  const departureDate = searchParams.get("departureDate");
  const tripType = searchParams.get("tripType");
  const returnDate = searchParams.get("returnDate");

  // Fetch train trips
  const {
    data: trainTripsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "trainTrips",
      departureStation,
      arrivalStation,
      departureDate,
      tripType,
      returnDate,
    ],
    queryFn: () =>
      trainTripApiRequest.list(1, 20, {
        departureStation: departureStation || undefined,
        arrivalStation: arrivalStation || undefined,
        departureDate: departureDate || undefined,
      }),
    select: (response) => response.payload.data.result,
    enabled: !!departureStation && !!arrivalStation && !!departureDate,
  });

  // Map train trips to frontend format
  const trains = trainTripsData
    ? mapTrainTripsToFrontend(
        filterTrainTrips(
          trainTripsData,
          departureStation,
          arrivalStation,
          departureDate,
          tripType,
          returnDate
        ),
        departureStation,
        arrivalStation
      )
    : [];

  // Use mutation for updating seat status
  const updateSeatMutation = useUpdateSeatMutation();

  // Handle train selection
  const handleTrainSelect = (trainId: string) => {
    const train = trains.find((t) => t.id === trainId) || null;
    setSelectedTrain(train);
    setSelectedCoach(null);
  };

  // Handle coach selection
  const handleCoachSelect = (coachId: number) => {
    if (!selectedTrain) return;
    const coach = selectedTrain.carriages.find((c) => c.id === coachId) || null;
    setSelectedCoach(coach);
  };

  const MAX_TICKETS = 10;

  // Handle seat selection and add to cart
  const toggleSeatSelection = async (seat: number) => {
    if (!selectedCoach || !selectedTrain) return;
    if (
      selectedCoach.bookedSeats.includes(seat) ||
      selectedCoach.pendingSeats.includes(seat)
    )
      return;

    const coachKey = `${selectedTrain.id}-${selectedCoach.id}`;
    const currentSeats = selectedSeatsByCoach[coachKey] || [];
    const newSelectedSeats = currentSeats.includes(seat)
      ? currentSeats.filter((s) => s !== seat)
      : [...currentSeats, seat];
    const isDeselecting = currentSeats.includes(seat);

    if (!isDeselecting && cartItems.length >= MAX_TICKETS) {
      alert(`Bạn chỉ có thể đặt tối đa ${MAX_TICKETS} vé trong một lần đặt!`);
      return;
    }

    if (!isDeselecting) {
      // Update seat status to pending in the backend
      const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
      if (seatData) {
        try {
          await updateSeatMutation.mutateAsync({
            id: seatData.seatId,
            seatNumber: seatData.seatNumber,
            seatType: seatData.seatType,
            price: seatData.price,
          });
          setPendingSeats((prev) => ({
            ...prev,
            [seatData.seatId]: Date.now(),
          }));
        } catch (error) {
          console.error("Failed to update seat status to pending:", error);
          return;
        }
      }
    }

    setSelectedSeatsByCoach((prev) => ({
      ...prev,
      [coachKey]: newSelectedSeats,
    }));

    if (!currentSeats.includes(seat)) {
      const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
      const price = seatData ? seatData.price : selectedCoach.basePrice;
      const newCartItem: CartItem = {
        trainId: selectedTrain.id,
        trainName: selectedTrain.name,
        trainTripId: selectedTrain.trainTripId,
        coachName: selectedCoach.name,
        seatNumber: seat,
        departure: selectedTrain.departure,
        arrival: selectedTrain.arrival,
        departureStation: selectedTrain.departureStation,
        departureStationId: selectedTrain.departureStationId,
        arrivalStation: selectedTrain.arrivalStation,
        arrivalStationId: selectedTrain.arrivalStationId,
        timestamp: Date.now(),
        price,
      };
      setCartItems((prev) => [...prev, newCartItem]);
      setTimer(600);
    } else {
      // If deselecting, revert seat to available
      const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
      if (seatData) {
        try {
          await updateSeatMutation.mutateAsync({
            id: seatData.seatId,
            seatStatus: "available",
            seatNumber: seatData.seatNumber,
            seatType: seatData.seatType,
            price: seatData.price,
          });
          setPendingSeats((prev) => {
            const newPending = { ...prev };
            delete newPending[seatData.seatId];
            return newPending;
          });
        } catch (error) {
          console.error("Failed to revert seat to available:", error);
        }
      }
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.trainId === selectedTrain.id &&
              item.seatNumber === seat &&
              item.coachName === selectedCoach.name
            )
        )
      );
    }
  };

  // Remove individual ticket from cart
  const removeTicket = async (item: CartItem) => {
    const coachKey = `${item.trainId}-${item.coachId}`;
    const seatData = selectedCoach?.seatData.find(
      (s) => s.seatId === item.seatNumber
    );
    if (seatData) {
      try {
        await updateSeatMutation.mutateAsync({
          id: seatData.seatId,
          seatStatus: "available",
          seatNumber: seatData.seatNumber,
          seatType: seatData.seatType,
          price: seatData.price,
        });
        setPendingSeats((prev) => {
          const newPending = { ...prev };
          delete newPending[seatData.seatId];
          return newPending;
        });
      } catch (error) {
        console.error("Failed to revert seat to available:", error);
      }
    }
    setCartItems((prev) =>
      prev.filter(
        (cartItem) =>
          !(
            cartItem.trainId === item.trainId &&
            cartItem.seatNumber === item.seatNumber &&
            cartItem.coachName === item.coachName
          )
      )
    );
    setSelectedSeatsByCoach((prev) => ({
      ...prev,
      [coachKey]: (prev[coachKey] || []).filter(
        (seat) => seat !== item.seatNumber
      ),
    }));
    if (cartItems.length === 1) setTimer(0);
  };

  // Clear all tickets from cart and revert pending seats
  const clearCart = async () => {
    for (const seatId of Object.keys(pendingSeats).map(Number)) {
      const seatData = selectedCoach?.seatData.find((s) => s.seatId === seatId);
      if (seatData) {
        try {
          await updateSeatMutation.mutateAsync({
            id: seatData.seatId,
            seatStatus: "available",
            seatNumber: seatData.seatNumber,
            seatType: seatData.seatType,
            price: seatData.price,
          });
        } catch (error) {
          console.error("Failed to revert seat to available:", error);
        }
      }
    }
    setCartItems([]);
    setSelectedSeatsByCoach({});
    setPendingSeats({});
    setTimer(0);
  };

  // Timer countdown and revert pending seats on timeout
  useEffect(() => {
    if (cartItems.length === 0 || timer <= 0) {
      if (timer <= 0 && Object.keys(pendingSeats).length > 0) {
        const revertSeats = async () => {
          for (const seatId of Object.keys(pendingSeats).map(Number)) {
            const seatData = selectedCoach?.seatData.find(
              (s) => s.seatId === seatId
            );
            if (seatData) {
              try {
                await updateSeatMutation.mutateAsync({
                  id: seatData.seatId,
                  seatStatus: "available",
                  seatNumber: seatData.seatNumber,
                  seatType: seatData.seatType,
                  price: seatData.price,
                });
              } catch (error) {
                console.error("Failed to revert seat to available:", error);
              }
            }
          }
          setPendingSeats({});
        };
        revertSeats();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCartItems([]);
          setSelectedSeatsByCoach({});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cartItems, timer, pendingSeats, selectedCoach, updateSeatMutation]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get current coach's selected seats
  const getCurrentSelectedSeats = () => {
    if (!selectedTrain || !selectedCoach) return [];
    const coachKey = `${selectedTrain.id}-${selectedCoach.id}`;
    return selectedSeatsByCoach[coachKey] || [];
  };

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div>
        <TrainTripSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>Error loading train trips: {(error as Error).message}</div>;
  }

  if (!departureStation || !arrivalStation || !departureDate) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl w-full">
          <div className="w-1/2 text-gray-700 text-base leading-relaxed">
            Please provide all required search parameters (departure station,
            arrival station, and departure date) to view available train trips.
            Use the search form to select your journey details.
          </div>
          <div className="w-1/2">
            <SearchTicket />
          </div>
        </div>
      </div>
    );
  }

  if (trains.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl w-full">
          <div className="w-1/2 text-gray-700 text-base leading-relaxed">
            <NoResults
              departureStation={departureStation}
              arrivalStation={arrivalStation}
              departureDate={departureDate}
            />
          </div>
          <div className="w-1/2">
            <SearchTicket />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
      <div className="col-span-3 border rounded-lg bg-white shadow-md p-4">
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Chọn tàu</h2>
          <div className="grid grid-cols-5 gap-4">
            {trains.map((train) => (
              <Card
                key={train.trainTripId}
                className={`relative p-4 text-center cursor-pointer flex flex-col justify-center items-center h-[250px] w-[200px] bg-cover bg-center border-none ${
                  selectedTrain?.id === train.id
                    ? "bg-blue-500"
                    : "bg-transparent"
                }`}
                style={{ backgroundImage: `url('/head-train3.png')` }}
                onClick={() => handleTrainSelect(train.id)}
              >
                <div className="absolute inset-0"></div>
                <CardContent className="relative z-10 text-black top-[-32px]">
                  <h3 className="text-lg font-bold p-1 w-fit inline-block">
                    {train.name}
                  </h3>
                  <div className="flex justify-between items-center mt-5">
                    <p className="text-sm whitespace-nowrap font-bold">
                      Ga đi:
                    </p>
                    <p className="whitespace-nowrap">
                      {train.departureStation}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm whitespace-nowrap font-bold">
                      Ga đến:
                    </p>
                    <p className="whitespace-nowrap">{train.arrivalStation}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm whitespace-nowrap font-bold">
                      TG đi:
                    </p>
                    <p className="whitespace-nowrap">{train.departure}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm whitespace-nowrap font-bold">
                      TG đến:
                    </p>
                    <p className="whitespace-nowrap">{train.arrival}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs whitespace-nowrap">Chỗ Đặt</p>
                    <p className="text-xs whitespace-nowrap">Chỗ Trống</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold whitespace-nowrap">
                      {train.carriages.reduce(
                        (sum, c) => sum + c.seats.length,
                        0
                      )}
                    </p>
                    <p className="text-lg font-bold whitespace-nowrap">
                      {train.availableSeats}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTrain && (
            <div className="flex items-center mt-3">
              <Image
                src="/train-head1.png"
                width={60}
                height={30}
                quality={100}
                alt="Train Head"
                className="w-[65px] h-auto"
              />
              {selectedTrain.carriages.map((coach) => (
                <Card
                  key={coach.id}
                  className={`relative p-4 text-center cursor-pointer bg-cover bg-center h-[70px] w-[100px] ${
                    selectedCoach?.id === coach.id ? "bg-blue-500" : ""
                  }`}
                  style={{ backgroundImage: `url('/carriage.png')` }}
                  onClick={() => handleCoachSelect(coach.id)}
                >
                  <h3 className="text-sm font-bold mt-3 text-white">
                    {coach.id}
                  </h3>
                </Card>
              ))}
            </div>
          )}

          {selectedCoach && (
            <div className="border-4 border-[#385d8a] p-4 mt-2 rounded-lg">
              <h2 className="text-xl text-center font-bold mt-2 mb-3">
                Toa Số {selectedCoach.id} : {selectedCoach.name}
              </h2>

              {/* Seat type rendering */}
              <div className="grid grid-cols-2 gap-4">
                {selectedCoach.type === "seat" &&
                  Array.from(
                    { length: selectedCoach.seats.length / 14 },
                    (_, partIndex) => {
                      const startIdx = partIndex * 14;
                      return (
                        <div
                          key={partIndex}
                          className="grid grid-cols-1 gap-2 border-x-4 border-blue-700 p-2 rounded-lg"
                        >
                          {Array.from({ length: 2 }, (_, rowIndex) => {
                            const rowStart = startIdx + rowIndex * 7;
                            return (
                              <div
                                key={rowIndex}
                                className="grid grid-cols-7 gap-5"
                              >
                                {Array.from({ length: 7 }, (_, colIndex) => {
                                  const seat =
                                    selectedCoach.seats[rowStart + colIndex];
                                  if (!seat) return null;
                                  const seatData = selectedCoach.seatData.find(
                                    (s) => s.seatId === seat
                                  );
                                  const price = seatData
                                    ? seatData.price
                                    : selectedCoach.basePrice;
                                  return (
                                    <div key={seat} className="relative group">
                                      <Card
                                        className={`p-0 text-center cursor-pointer bg-cover bg-center h-[60px] w-[60px] flex items-center justify-center ${
                                          selectedCoach.bookedSeats.includes(
                                            seat
                                          )
                                            ? "bg-orange-600 text-white cursor-not-allowed"
                                            : selectedCoach.pendingSeats.includes(
                                                seat
                                              )
                                            ? "bg-yellow-500 text-white cursor-not-allowed"
                                            : getCurrentSelectedSeats().includes(
                                                seat
                                              )
                                            ? "bg-[#a6b727] text-white"
                                            : "bg-transparent"
                                        }`}
                                        style={{
                                          backgroundImage: `url('/seat.png')`,
                                        }}
                                        onClick={() =>
                                          toggleSeatSelection(seat)
                                        }
                                      >
                                        <h3 className="text-sm font-bold">
                                          {seat}
                                        </h3>
                                      </Card>
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                        {formatPrice(price)}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  )}
              </div>

              {/* 4-bed type rendering */}
              <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-4">
                {selectedCoach.type === "4-bed" &&
                  Array.from(
                    { length: selectedCoach.seats.length / 4 },
                    (_, i) => {
                      const startIdx = i * 4;
                      return (
                        <div
                          key={i}
                          className="grid grid-rows-2 gap-2 text-center border-x-4 border-blue-700 p-2 rounded-lg"
                        >
                          {[0, 2].map((offset, rowIndex) => {
                            const seatT1 =
                              selectedCoach.seats[startIdx + offset];
                            const seatT2 =
                              selectedCoach.seats[startIdx + offset + 1];
                            return (
                              <div
                                key={seatT1}
                                className={`flex gap-2 ${
                                  rowIndex === 0
                                    ? "border-b-2 border-gray-500"
                                    : ""
                                }`}
                              >
                                {[seatT1, seatT2].map((seat) => {
                                  const seatData = selectedCoach.seatData.find(
                                    (s) => s.seatId === seat
                                  );
                                  const price = seatData
                                    ? seatData.price
                                    : selectedCoach.basePrice;
                                  return (
                                    <div key={seat} className="relative group">
                                      <Card
                                        className={`p-2 text-center cursor-pointer bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
                                          selectedCoach.bookedSeats.includes(
                                            seat
                                          )
                                            ? "bg-orange-600 text-white cursor-not-allowed"
                                            : selectedCoach.pendingSeats.includes(
                                                seat
                                              )
                                            ? "bg-yellow-500 text-white cursor-not-allowed"
                                            : getCurrentSelectedSeats().includes(
                                                seat
                                              )
                                            ? "bg-[#a6b727] text-white"
                                            : "bg-transparent"
                                        }`}
                                        style={{
                                          backgroundImage: `url('/bed.png')`,
                                        }}
                                        onClick={() =>
                                          toggleSeatSelection(seat)
                                        }
                                      >
                                        <h3 className="text-sm font-bold">
                                          {seat}
                                        </h3>
                                      </Card>
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                        {formatPrice(price)}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  )}
              </div>

              {/* 6-bed type rendering */}
              <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-4">
                {selectedCoach.type === "6-bed" &&
                  Array.from(
                    { length: selectedCoach.seats.length / 6 },
                    (_, i) => {
                      const startIdx = i * 6;
                      return (
                        <div
                          key={i}
                          className="grid grid-rows-3 gap-2 text-center border-x-4 border-blue-700 p-1 rounded-lg"
                        >
                          {[0, 2, 4].map((offset, rowIndex) => {
                            const seatT1 =
                              selectedCoach.seats[startIdx + offset];
                            const seatT2 =
                              selectedCoach.seats[startIdx + offset + 1];
                            return (
                              <div
                                key={seatT1}
                                className={`flex gap-2 ${
                                  rowIndex < 2
                                    ? "border-b-2 border-gray-500 pb-2"
                                    : ""
                                }`}
                              >
                                {[seatT1, seatT2].map((seat) => {
                                  const seatData = selectedCoach.seatData.find(
                                    (s) => s.seatId === seat
                                  );
                                  const price = seatData
                                    ? seatData.price
                                    : selectedCoach.basePrice;
                                  return (
                                    <div key={seat} className="relative group">
                                      <Card
                                        className={`p-2 text-center cursor-pointer bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
                                          selectedCoach.bookedSeats.includes(
                                            seat
                                          )
                                            ? "bg-orange-600 text-white cursor-not-allowed"
                                            : selectedCoach.pendingSeats.includes(
                                                seat
                                              )
                                            ? "bg-yellow-500 text-white cursor-not-allowed"
                                            : getCurrentSelectedSeats().includes(
                                                seat
                                              )
                                            ? "bg-[#a6b727] text-white"
                                            : "bg-transparent"
                                        }`}
                                        style={{
                                          backgroundImage: `url('/bed.png')`,
                                        }}
                                        onClick={() =>
                                          toggleSeatSelection(seat)
                                        }
                                      >
                                        <h3 className="text-sm font-bold">
                                          {seat}
                                        </h3>
                                      </Card>
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                        {formatPrice(price)}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <div className="w-full border rounded-lg w-72 bg-white shadow-md p-4">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <div className="text-base font-semibold">Giỏ Vé</div>
            {cartItems.length > 0 && (
              <Button variant="destructive" size="sm" onClick={clearCart}>
                Xóa tất cả <Trash2 />
              </Button>
            )}
          </div>
          {cartItems.length > 0 ? (
            <div className="flex flex-col space-y-3">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b pb-2 flex justify-between items-start border rounded-lg p-2 bg-white shadow-md"
                >
                  <div>
                    <p className="font-semibold">{item.trainName}</p>
                    <p className="text-sm">
                      <span className="font-bold">Toa: {item.coachId} -</span>{" "}
                      {item.coachName}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-sm">
                        <span className="font-bold">Ghế:</span>{" "}
                        {item.seatNumber} -
                      </p>
                      <p className="text-sm">
                        <span className="font-bold">Giá:</span>{" "}
                        <span className="text-red-500 font-bold text-md">
                          {formatPrice(item.price)}
                        </span>
                      </p>
                    </div>
                    <div className="flex-row gap-2">
                      <p className="text-sm">
                        <span className="font-bold">Ga đi:</span>{" "}
                        {item.departureStation}
                      </p>
                      <p className="text-sm">
                        <span className="font-bold">Ga đến:</span>{" "}
                        {item.arrivalStation}
                      </p>
                      <p className="text-sm">
                        <span className="font-bold">Khởi hành:</span>{" "}
                        {item.departure}
                      </p>
                      <p className="text-sm">
                        <span className="font-bold">Đến:</span> {item.arrival}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTicket(item)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <div className="mt-2">
                <p className="text-sm font-bold">
                  Thời gian giữ vé: {formatTime(timer)}
                </p>
                <Button
                  className="mt-2 w-full"
                  onClick={() => {
                    const query = new URLSearchParams({
                      tickets: JSON.stringify(cartItems),
                      timer: timer.toString(),
                    }).toString();
                    router.push(`/payment?${query}`);
                    setCartItems([]);
                    setSelectedSeatsByCoach({});
                    setPendingSeats({});
                  }}
                >
                  Xác nhận đặt vé
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Chưa có vé nào trong giỏ</p>
          )}
        </div>
        <div className="mt-5 w-full border rounded-lg w-72 bg-white shadow-md p-4">
          <SearchTicket />
        </div>
      </div>
    </div>
  );
}
