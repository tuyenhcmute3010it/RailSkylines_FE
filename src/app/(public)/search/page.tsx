"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SearchTicket from "../search-ticket";
import { Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import trainTripApiRequest from "@/queries/useTrainTrip";
import { useUpdateSeatMutation } from "@/queries/useSeat";
import TrainTripSkeleton from "@/components/TrainTripSkeleton";
import NoResults from "@/components/no-Result";
import { debounce } from "lodash";
import envConfig from "@/config";
// Interfaces (unchanged)
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
  arrival: { clockTimeId: number; date: string; hour: number; minute: number };
}

interface Ticket {
  ticketId: number;
  boardingStationId: number;
  alightingStationId: number;
}

interface Seat {
  seatId: number;
  seatNumber: number | null;
  seatType: string;
  seatStatus: "available" | "unavailable" | "pending";
  price: number;
  tickets: Ticket[];
  carriage: {
    carriageId: number;
    carriageType: "fourBeds" | "sixBeds" | "seat";
    price: number;
    discount: number;
    train: {
      trainId: number;
      trainName: string;
      trainStatus: string;
    };
  };
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
  discount: number;
  seatData: Seat[];
  bookedSeats: number[];
  pendingSeats: number[];
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
  departurePosition: number;
  arrivalPosition: number;
  availableSeats: number;
  carriages: FrontendCarriage[];
  trainTripId: number;
}

export type TrainTrip = {
  trainTripId: number;
  train: Train;
  route: Route;
  schedule: Schedule;
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

// Validate date and time (unchanged)
const isValidDateString = (dateStr: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateStr) && !isNaN(new Date(dateStr).getTime());
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

// Map API train trips (unchanged)
const mapTrainTripsToFrontend = (
  trainTrips: TrainTrip[],
  departureStation: string | null,
  arrivalStation: string | null
): FrontendTrain[] => {
  const fallbackDateTime = new Date();
  return trainTrips
    .filter((trip) => {
      if (!trip.schedule) return false;
      const { departure, arrival } = trip.schedule;
      return (
        isValidDateString(departure.date.split("T")[0]) &&
        isValidDateString(arrival.date.split("T")[0]) &&
        isValidTime(departure.hour, departure.minute) &&
        isValidTime(arrival.hour, arrival.minute)
      );
    })
    .map((trip) => {
      const carriages = trip.train.carriages
        .filter((carriage) => carriage.seats.length > 0)
        .map((carriage) => {
          const maxSeats =
            carriage.carriageType === "sixBeds"
              ? 42
              : carriage.carriageType === "fourBeds"
              ? 28
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
            discount: carriage.discount,
            seatData: limitedSeats,
            bookedSeats: limitedSeats
              .filter((seat) => seat.seatStatus === "unavailable")
              .map((seat) => seat.seatId),
            pendingSeats: limitedSeats
              .filter((seat) => seat.seatStatus === "pending")
              .map((seat) => seat.seatId),
          };
        });

      const totalAvailableSeats = carriages.reduce(
        (sum, carriage) =>
          sum +
          carriage.seatData.filter((seat) => seat.seatStatus === "available")
            .length,
        0
      );

      const departureDateTime = new Date(trip.schedule.departure.date);
      const arrivalDateTime = new Date(trip.schedule.arrival.date);

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
        departurePosition: departureStationData?.position || 0,
        arrivalPosition: arrivalStationData?.position || 0,
        availableSeats: totalAvailableSeats,
        carriages,
        trainTripId: trip.trainTripId,
      };
    });
};

// Filter train trips (unchanged)
const filterTrainTrips = (
  trainTrips: TrainTrip[],
  departureStation: string | null,
  arrivalStation: string | null,
  departureDate: string | null,
  tripType: string | null,
  returnDate: string | null
): TrainTrip[] => {
  if (!departureStation || !arrivalStation || !departureDate) return [];
  return trainTrips.filter((trip) => {
    const allStations = [trip.route.originStation, ...trip.route.journey].map(
      (station) => station.stationName.toLowerCase()
    );
    const departureIndex = allStations.indexOf(departureStation.toLowerCase());
    const arrivalIndex = allStations.indexOf(arrivalStation.toLowerCase());
    const stationMatch =
      departureIndex !== -1 &&
      arrivalIndex !== -1 &&
      departureIndex < arrivalIndex;
    const dateMatch =
      trip.schedule?.departure.date.split("T")[0] ===
      new Date(departureDate).toISOString().split("T")[0];
    let returnMatch = true;
    if (tripType === "round-trip" && returnDate) returnMatch = true;
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
  const [availableSeats, setAvailableSeats] = useState<number[]>([]);
  const [seatError, setSeatError] = useState<string | null>(null);

  const departureStation = searchParams.get("departureStation");
  const arrivalStation = searchParams.get("arrivalStation");
  const departureDate = searchParams.get("departureDate");
  const tripType = searchParams.get("tripType");
  const returnDate = searchParams.get("returnDate");

  // Validate query parameters
  if (
    !departureStation ||
    !arrivalStation ||
    !isValidDateString(departureDate || "")
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex gap-8 p-6 bg-white rounded-2xl shadow-lg max-w-4xl w-full">
          <div className="w-1/2 text-gray-700 text-base leading-relaxed">
            Vui lòng cung cấp đầy đủ thông tin tìm kiếm hợp lệ để xem các chuyến
            tàu có sẵn.
          </div>
          <div className="w-1/2">
            <SearchTicket />
          </div>
        </div>
      </div>
    );
  }

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
    queryFn: async () => {
      try {
        const response = await trainTripApiRequest.list(1, 20, {
          departureStation,
          arrivalStation,
          departureDate,
        });
        return response;
      } catch (err) {
        console.error("Error fetching train trips:", err);
        throw err;
      }
    },
    select: (response) => response.payload.data.result,
    enabled: !!departureStation && !!arrivalStation && !!departureDate,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch available seats
  const {
    data: availableSeatsData,
    isLoading: isSeatsLoading,
    isError: availableSeatsError,
  } = useQuery({
    queryKey: [
      "availableSeats",
      selectedTrain?.trainTripId,
      selectedTrain?.departureStationId,
      selectedTrain?.arrivalStationId,
      selectedCoach?.id,
    ],
    queryFn: async () => {
      if (!selectedTrain || !selectedCoach) return { data: [] };
      const response = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/api/v1/seats/available?trainTripId=${selectedTrain.trainTripId}&boardingStationId=${selectedTrain.departureStationId}&alightingStationId=${selectedTrain.arrivalStationId}`
      );
      if (!response.ok) throw new Error("Failed to fetch available seats");
      const data = await response.json();
      console.log("API response for seats:", data);
      return data;
    },
    enabled:
      !!selectedTrain &&
      !!selectedTrain.departureStationId &&
      !!selectedTrain.arrivalStationId &&
      !!selectedCoach,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
  });

  // Compute derived seat data
  const derivedSeatData = useMemo(() => {
    if (!selectedCoach) {
      return {
        filteredSeats: [],
        seatIds: [],
        bookedSeats: [],
        pendingSeats: [],
      };
    }

    // Use selectedCoach.seatData as the source of truth for all seats
    const filteredSeats = selectedCoach.seatData.map((seat) => {
      const apiSeat = availableSeatsData?.find(
        (apiSeat: Seat) => apiSeat.seatId === seat.seatId
      );
      return {
        ...seat,
        seatStatus: apiSeat ? apiSeat.seatStatus : "unavailable", // Mark as unavailable if not in API response
        price: apiSeat ? apiSeat.price : seat.price, // Keep original price if not in API
      };
    });

    const seatIds = filteredSeats
      .filter((seat) => seat.seatStatus === "available")
      .map((seat) => seat.seatId);
    const bookedSeats = filteredSeats
      .filter((seat) => seat.seatStatus === "unavailable")
      .map((seat) => seat.seatId);
    const pendingSeats = filteredSeats
      .filter((seat) => seat.seatStatus === "pending")
      .map((seat) => seat.seatId);

    return {
      filteredSeats,
      seatIds,
      bookedSeats,
      pendingSeats,
    };
  }, [availableSeatsData, selectedCoach]);

  // Update seats and coach state
  useEffect(() => {
    if (!selectedCoach) return;

    const { filteredSeats, seatIds, bookedSeats, pendingSeats } =
      derivedSeatData;

    setAvailableSeats(seatIds);

    // Update selectedCoach with the full seat data
    setSelectedCoach((prev) => {
      if (!prev) return prev;

      const updatedSeatData = filteredSeats.map((seat) => ({
        ...seat,
        seatNumber: seat.seatId,
      }));

      // Check if update is necessary
      const isSeatDataSame =
        JSON.stringify(prev.seatData) === JSON.stringify(updatedSeatData);
      const isSeatsSame =
        JSON.stringify(prev.seats) ===
        JSON.stringify(updatedSeatData.map((seat) => seat.seatId));
      const isBookedSeatsSame =
        JSON.stringify(prev.bookedSeats) === JSON.stringify(bookedSeats);
      const isPendingSeatsSame =
        JSON.stringify(prev.pendingSeats) === JSON.stringify(pendingSeats);

      if (
        isSeatDataSame &&
        isSeatsSame &&
        isBookedSeatsSame &&
        isPendingSeatsSame
      ) {
        return prev; // No update needed
      }

      return {
        ...prev,
        seatData: updatedSeatData,
        seats: updatedSeatData.map((seat) => seat.seatId), // Include all seats
        bookedSeats,
        pendingSeats,
      };
    });

    setSeatError(
      availableSeatsError
        ? "Không thể tải danh sách ghế. Vui lòng thử lại."
        : null
    );
  }, [derivedSeatData, availableSeatsError, selectedCoach]);

  const trains = useMemo(
    () =>
      trainTripsData
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
        : [],
    [
      trainTripsData,
      departureStation,
      arrivalStation,
      departureDate,
      tripType,
      returnDate,
    ]
  );

  const updateSeatMutation = useUpdateSeatMutation();

  const handleTrainSelect = useCallback(
    (trainId: string) => {
      const train = trains.find((t) => t.id === trainId) || null;
      setSelectedTrain(train);
      setSelectedCoach(null);
      setAvailableSeats([]);
      setSelectedSeatsByCoach({});
      setCartItems([]);
      setPendingSeats({});
      setTimer(0);
      setSeatError(null);
    },
    [trains]
  );

  const handleCoachSelect = useCallback(
    (coachId: number) => {
      if (!selectedTrain) return;
      const coach =
        selectedTrain.carriages.find((c) => c.id === coachId) || null;
      console.log("Selected coach:", coach);
      setSelectedCoach(coach);
      setSeatError(null);
    },
    [selectedTrain]
  );

  const MAX_TICKETS = 10;

  const toggleSeatSelection = useCallback(
    debounce(async (seat: number) => {
      if (!selectedCoach || !selectedTrain) return;
      const seatData = selectedCoach.seatData.find((s) => s.seatId === seat);
      if (!seatData) {
        console.error(`Seat ${seat} not found in selectedCoach.seatData`);
        return;
      }
      if (seatData.seatStatus !== "available") {
        alert("Ghế này không khả dụng!");
        return;
      }
      const coachKey = `${selectedTrain.id}-${selectedCoach.id}`;
      const currentSeats = selectedSeatsByCoach[coachKey] || [];
      const isDeselecting = currentSeats.includes(seat);
      const newSelectedSeats = isDeselecting
        ? currentSeats.filter((s) => s !== seat)
        : [...currentSeats, seat];

      if (!isDeselecting && cartItems.length >= MAX_TICKETS) {
        alert(`Bạn chỉ có thể đặt tối đa ${MAX_TICKETS} vé trong một lần đặt!`);
        return;
      }

      // Validate trainTripId
      if (!selectedTrain.trainTripId) {
        console.error("Invalid trainTripId for selected train:", selectedTrain);
        alert("Lỗi: Không thể xác định ID chuyến tàu. Vui lòng thử lại.");
        return;
      }

      if (!isDeselecting) {
        try {
          await updateSeatMutation.mutateAsync({
            id: seatData.seatId,
            seatStatus: "unavailable",
            seatNumber: seatData.seatNumber,
            seatType: seatData.seatType,
            price: seatData.price,
          });
          setPendingSeats((prev) => ({
            ...prev,
            [seatData.seatId]: Date.now(),
          }));
        } catch (error) {
          console.error("Không thể đặt ghế này:", error);
          alert("Không thể đặt ghế này. Vui lòng thử lại!");
          return;
        }
      }

      setSelectedSeatsByCoach((prev) => ({
        ...prev,
        [coachKey]: newSelectedSeats,
      }));
      if (!isDeselecting) {
        const price = seatData.price;
        const newCartItem: CartItem = {
          trainId: selectedTrain.id,
          trainName: selectedTrain.name,
          trainTripId: selectedTrain.trainTripId,
          coachName: selectedCoach.name,
          coachId: selectedCoach.id,
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
        console.log("Adding cart item:", newCartItem);
        setCartItems((prev) => [...prev, newCartItem]);
        setTimer(600);
      } else {
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
          console.error("Không thể hoàn tác trạng thái ghế:", error);
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
    }, 300),
    [
      selectedCoach,
      selectedTrain,
      selectedSeatsByCoach,
      cartItems.length,
      updateSeatMutation,
    ]
  );

  const removeTicket = useCallback(
    async (item: CartItem) => {
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
          console.error("Không thể hoàn tác trạng thái ghế:", error);
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
    },
    [selectedCoach, cartItems.length, updateSeatMutation]
  );

  const clearCart = useCallback(async () => {
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
          console.error("Không thể hoàn tác trạng thái ghế:", error);
        }
      }
    }
    setCartItems([]);
    setSelectedSeatsByCoach({});
    setPendingSeats({});
    setTimer(0);
  }, [pendingSeats, selectedCoach, updateSeatMutation]);

  useEffect(() => {
    if (cartItems.length === 0 || timer <= 0) {
      if (timer <= 0 && Object.keys(pendingSeats).length > 0) {
        const revertSeats = async () => {
          try {
            for (const seatId of Object.keys(pendingSeats).map(Number)) {
              const seatData = selectedCoach?.seatData.find(
                (s) => s.seatId === seatId
              );
              if (seatData) {
                await updateSeatMutation.mutateAsync({
                  id: seatData.seatId,
                  seatStatus: "available",
                  seatNumber: seatData.seatNumber,
                  seatType: seatData.seatType,
                  price: seatData.price,
                });
              }
            }
            setPendingSeats({});
          } catch (error) {
            console.error("Không thể hoàn tác trạng thái ghế:", error);
            alert("Lỗi khi hoàn tác ghế. Vui lòng thử lại.");
          }
        };
        revertSeats();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [
    cartItems.length,
    timer,
    pendingSeats,
    selectedCoach,
    updateSeatMutation,
  ]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const getCurrentSelectedSeats = useCallback(() => {
    if (!selectedTrain || !selectedCoach) return [];
    const coachKey = `${selectedTrain.id}-${selectedCoach.id}`;
    return selectedSeatsByCoach[coachKey] || [];
  }, [selectedTrain, selectedCoach, selectedSeatsByCoach]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  if (isLoading) return <TrainTripSkeleton />;
  if (error)
    return (
      <div>Lỗi khi tải danh sách chuyến tàu: {(error as Error).message}</div>
    );

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
                  <p className="text-sm whitespace-nowrap font-bold">Ga đi:</p>
                  <p className="whitespace-nowrap">{train.departureStation}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm whitespace-nowrap font-bold">Ga đến:</p>
                  <p className="whitespace-nowrap">{train.arrivalStation}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm whitespace-nowrap font-bold">TG đi:</p>
                  <p className="whitespace-nowrap">{train.departure}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm whitespace-nowrap font-bold">TG đến:</p>
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

            {isSeatsLoading ? (
              <div className="text-center">Đang tải danh sách ghế...</div>
            ) : seatError ? (
              <div className="text-center text-red-500">{seatError}</div>
            ) : (
              <>
                {/* Seat type rendering */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedCoach.type === "seat" &&
                    Array.from(
                      { length: Math.ceil(selectedCoach.seats.length / 14) },
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
                                    const seatIdx = rowStart + colIndex;
                                    const seat = selectedCoach.seats[seatIdx];
                                    if (!seat) return null;
                                    const seatData =
                                      selectedCoach.seatData.find(
                                        (s) => s.seatId === seat
                                      );
                                    const price = seatData
                                      ? seatData.price
                                      : selectedCoach.basePrice;
                                    const isBooked =
                                      seatData?.seatStatus === "unavailable";
                                    const isPending =
                                      seatData?.seatStatus === "pending";
                                    const isSelected =
                                      getCurrentSelectedSeats().includes(seat);

                                    return (
                                      <div
                                        key={seat}
                                        className="relative group"
                                      >
                                        <Card
                                          className={`p-0 text-center bg-cover bg-center h-[60px] w-[60px] flex items-center justify-center ${
                                            isBooked
                                              ? "bg-red-500 text-white cursor-not-allowed"
                                              : isPending
                                              ? "bg-yellow-500 text-white cursor-not-allowed"
                                              : isSelected
                                              ? "bg-[#a6b727] text-white"
                                              : "bg-transparent cursor-pointer"
                                          }`}
                                          style={{
                                            backgroundImage: `url('/seat.png')`,
                                          }}
                                          onClick={() =>
                                            !isBooked &&
                                            !isPending &&
                                            toggleSeatSelection(seat)
                                          }
                                        >
                                          <h3 className="text-sm font-bold">
                                            {seat}
                                          </h3>
                                        </Card>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                          {formatPrice(price)}{" "}
                                          {isBooked
                                            ? "(Không khả dụng)"
                                            : isPending
                                            ? "(Đang chờ)"
                                            : ""}
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
                      { length: Math.ceil(selectedCoach.seats.length / 4) },
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
                                    if (!seat) return null;
                                    const seatData =
                                      selectedCoach.seatData.find(
                                        (s) => s.seatId === seat
                                      );
                                    const price = seatData
                                      ? seatData.price
                                      : selectedCoach.basePrice;
                                    const isBooked =
                                      seatData?.seatStatus === "unavailable";
                                    const isPending =
                                      seatData?.seatStatus === "pending";
                                    const isSelected =
                                      getCurrentSelectedSeats().includes(seat);

                                    return (
                                      <div
                                        key={seat}
                                        className="relative group"
                                      >
                                        <Card
                                          className={`p-2 text-center bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
                                            isBooked
                                              ? "bg-red-500 text-white cursor-not-allowed"
                                              : isPending
                                              ? "bg-yellow-500 text-white cursor-not-allowed"
                                              : isSelected
                                              ? "bg-[#a6b727] text-white"
                                              : "bg-transparent cursor-pointer"
                                          }`}
                                          style={{
                                            backgroundImage: `url('/bed.png')`,
                                          }}
                                          onClick={() =>
                                            !isBooked &&
                                            !isPending &&
                                            toggleSeatSelection(seat)
                                          }
                                        >
                                          <h3 className="text-sm font-bold">
                                            {seat}
                                          </h3>
                                        </Card>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                          {formatPrice(price)}{" "}
                                          {isBooked
                                            ? "(Không khả dụng)"
                                            : isPending
                                            ? "(Đang chờ)"
                                            : ""}
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
                      { length: Math.ceil(selectedCoach.seats.length / 6) },
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
                                    if (!seat) return null;
                                    const seatData =
                                      selectedCoach.seatData.find(
                                        (s) => s.seatId === seat
                                      );
                                    const price = seatData
                                      ? seatData.price
                                      : selectedCoach.basePrice;
                                    const isBooked =
                                      seatData?.seatStatus === "unavailable";
                                    const isPending =
                                      seatData?.seatStatus === "pending";
                                    const isSelected =
                                      getCurrentSelectedSeats().includes(seat);

                                    return (
                                      <div
                                        key={seat}
                                        className="relative group"
                                      >
                                        <Card
                                          className={`p-2 text-center bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
                                            isBooked
                                              ? "bg-red-500 text-white cursor-not-allowed"
                                              : isPending
                                              ? "bg-yellow-500 text-white cursor-not-allowed"
                                              : isSelected
                                              ? "bg-[#a6b727] text-white"
                                              : "bg-transparent cursor-pointer"
                                          }`}
                                          style={{
                                            backgroundImage: `url('/bed.png')`,
                                          }}
                                          onClick={() =>
                                            !isBooked &&
                                            !isPending &&
                                            toggleSeatSelection(seat)
                                          }
                                        >
                                          <h3 className="text-sm font-bold">
                                            {seat}
                                          </h3>
                                        </Card>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                          {formatPrice(price)}{" "}
                                          {isBooked
                                            ? "(Không khả dụng)"
                                            : isPending
                                            ? "(Đang chờ)"
                                            : ""}
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
              </>
            )}
          </div>
        )}
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
                    // Validate cart items
                    const invalidItems = cartItems.filter(
                      (item) => !item.trainTripId
                    );
                    if (invalidItems.length > 0) {
                      console.error("Invalid cart items:", invalidItems);
                      alert(
                        "Lỗi: Một số vé không có ID chuyến tàu hợp lệ. Vui lòng thử lại."
                      );
                      return;
                    }
                    const query = new URLSearchParams({
                      tickets: JSON.stringify(cartItems),
                      timer: timer.toString(),
                    }).toString();
                    console.log("Navigating to payment with query:", query);
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
