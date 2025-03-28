"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchTicket from "../search-ticket";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
const trains = [
  {
    id: "SE8",
    name: "SE8",
    departure: "27/3 06:32",
    arrival: "27/3 21:48",
    availableSeats: 137,
    carriages: [
      {
        id: 1,
        name: "Ngồi mềm điều hòa",
        type: "seat",
        basePrice: 500000, // Base price in VND
        seats: Array.from({ length: 56 }, (_, i) => i + 1),
        bookedSeats: [
          1, 2, 3, 6, 7, 8, 9, 10, 14, 15, 16, 18, 19, 20, 21, 23, 24,
        ],
      },
      {
        id: 2,
        name: " Ngồi cứng điều hòa",
        type: "seat",
        basePrice: 500000, // Base price in VND
        seats: Array.from({ length: 56 }, (_, i) => i + 1),
        bookedSeats: [4, 5, 11, 12, 17, 22, 25, 26, 30, 31],
      },
      {
        id: 3,
        name: " Ngồi cứng điều hòa",
        type: "seat",
        basePrice: 500000, // Base price in VND
        seats: Array.from({ length: 56 }, (_, i) => i + 1),
        bookedSeats: [4, 5, 11, 12, 17, 22, 25, 26, 30, 31],
      },
      {
        id: 4,
        name: " Ngồi cứng điều hòa",
        type: "seat",
        basePrice: 500000, // Base price in VND
        seats: Array.from({ length: 56 }, (_, i) => i + 1),
        bookedSeats: [4, 5, 11, 12, 17, 22, 25, 26, 30, 31],
      },
      {
        id: 5,
        name: " Ngồi cứng điều hòa",
        type: "seat",
        basePrice: 500000, // Base price in VND
        seats: Array.from({ length: 56 }, (_, i) => i + 1),
        bookedSeats: [4, 5, 11, 12, 17, 22, 25, 26, 30, 31],
      },
    ],
  },
  {
    id: "SE22",
    name: "SE22",
    departure: "28/3 10:53",
    arrival: "29/3 03:48",
    availableSeats: 145,
    carriages: [
      {
        id: 1,
        name: "Giường nằm khoang 4",
        basePrice: 900000, // Base price in VND
        type: "4-bed",
        seats: Array.from({ length: 28 }, (_, i) => i + 1),
        bookedSeats: [1, 3, 5, 8, 10, 12, 15, 18, 22, 25],
      },
    ],
  },
  {
    id: "SE3",
    name: "SE3",
    departure: "27/3 19:30",
    arrival: "28/3 12:45",
    availableSeats: 112,
    carriages: [
      {
        id: 1,
        name: "Giường nằm khoang 6",
        basePrice: 700000, // Base price in VND
        type: "6-bed",
        seats: Array.from({ length: 42 }, (_, i) => i + 1),
        bookedSeats: [2, 4, 7, 11, 14, 17, 19, 21, 26, 30, 35],
      },
      {
        id: 2,
        name: " Ngồi cứng điều hòa",
        type: "seat",
        basePrice: 500000, // Base price in VND
        seats: Array.from({ length: 56 }, (_, i) => i + 1),
        bookedSeats: [5, 9, 13, 22, 24, 28, 31, 37, 40],
      },
    ],
  },
  {
    id: "TN1",
    name: "TN1",
    departure: "29/3 08:00",
    arrival: "30/3 05:20",
    availableSeats: 156,
    carriages: [
      {
        id: 1,
        name: "Ngồi mềm điều hòa",
        basePrice: 500000, // Base price in VND
        type: "seat",
        seats: Array.from({ length: 56 }, (_, i) => i + 1),
        bookedSeats: [1, 6, 9, 15, 19, 21, 29, 34, 40, 48, 53, 58, 60],
      },
      {
        id: 2,
        name: " Giường nằm khoang 4",
        type: "4-bed",
        basePrice: 1000000, // Base price in VND
        seats: Array.from({ length: 28 }, (_, i) => i + 1),
        bookedSeats: [2, 5, 10, 14, 18, 22, 27, 30],
      },
    ],
  },
  {
    id: "SE7",
    name: "SE7",
    departure: "30/3 14:20",
    arrival: "31/3 08:30",
    availableSeats: 90,
    carriages: [
      {
        id: 1,
        name: "Giường nằm khoang 6",
        basePrice: 600000, // Base price in VND
        type: "6-bed",
        seats: Array.from({ length: 42 }, (_, i) => i + 1),
        bookedSeats: [3, 7, 12, 16, 20, 24, 29, 32, 38, 40],
      },
      {
        id: 2,
        name: " Ngồi cứng điều hòa",
        basePrice: 500000, // Base price in VND
        type: "seat",
        seats: Array.from({ length: 56 }, (_, i) => i + 1),
        bookedSeats: [5, 8, 15, 22, 28, 33, 39, 44, 51, 55],
      },
    ],
  },
];

// ... (keep the trains array unchanged)
interface CartItem {
  trainId: string;
  trainName: string;
  coachName: string;
  coachId: number;
  seatNumber: number;
  departure: string;
  arrival: string;
  timestamp: number;
  price: number; // Added price field
}

// ... (trains array remains unchanged)

export default function Search() {
  const router = useRouter(); // Add this line
  const [selectedTrain, setSelectedTrain] = useState<(typeof trains)[0] | null>(
    null
  );
  const [selectedCoach, setSelectedCoach] = useState<
    (typeof trains)[0]["carriages"][0] | null
  >(null);
  const [selectedSeatsByCoach, setSelectedSeatsByCoach] = useState<
    Record<string, number[]>
  >({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [timer, setTimer] = useState(600);

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
  const MAX_TICKETS = 10; // Maximum allowed tickets
  // Handle seat selection and add to cart
  const toggleSeatSelection = (seat: number) => {
    if (!selectedCoach || !selectedTrain) return;
    if (selectedCoach.bookedSeats.includes(seat)) return;

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
    setSelectedSeatsByCoach((prev) => ({
      ...prev,
      [coachKey]: newSelectedSeats,
    }));

    // Update cart
    if (!currentSeats.includes(seat)) {
      const price = calculateSeatPrice(
        selectedCoach.basePrice,
        seat,
        selectedCoach.type
      );
      const newCartItem: CartItem = {
        trainId: selectedTrain.id,
        trainName: selectedTrain.name,
        coachName: selectedCoach.name,
        seatNumber: seat,
        departure: selectedTrain.departure,
        arrival: selectedTrain.arrival,
        coachId: selectedCoach.id,
        timestamp: Date.now(),
        price,
      };
      setCartItems((prev) => [...prev, newCartItem]);
      setTimer(600);
    } else {
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
  const removeTicket = (item: CartItem) => {
    const coachKey = `${item.trainId}-${
      selectedTrain?.carriages.find((c) => c.name === item.coachName)?.id
    }`;
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
    if (cartItems.length === 1) setTimer(0); // Stop timer if last item is removed
  };

  // Clear all tickets from cart
  const clearCart = () => {
    setCartItems([]);
    setSelectedSeatsByCoach({});
    setTimer(0);
  };

  // Timer countdown
  useEffect(() => {
    if (cartItems.length === 0 || timer <= 0) return;

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
  }, [cartItems, timer]);

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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const calculateSeatPrice = (
    basePrice: number,
    seatNumber: number,
    type: string
  ) => {
    if (type === "seat") return basePrice;

    if (type === "6-bed") {
      const positionInCompartment = (seatNumber + 1) % 6;
      if (positionInCompartment >= 4) return basePrice * 0.9; // Tier 2: -10%
      if (positionInCompartment >= 2) return basePrice * 0.8; // Tier 3: -20%
      return basePrice; // Tier 1: full price
    }

    if (type === "4-bed") {
      const positionInCompartment = (seatNumber + 1) % 4;
      if (positionInCompartment >= 2) return basePrice * 0.9; // Upper beds: -10%
      return basePrice; // Lower beds: full price
    }

    return basePrice;
  };
  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
      <div className="col-span-3 border rounded-lg bg-white shadow-md p-4">
        {/* ... (train and coach selection UI unchanged) */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-center">Chọn tàu</h2>
          <div className="grid grid-cols-5 gap-4">
            {trains.map((train) => (
              <Card
                key={train.id}
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
                      TG đi :
                    </p>
                    <p className="whitespace-nowrap">{train.departure}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm whitespace-nowrap font-bold">
                      TG đến :
                    </p>
                    <p className="whitespace-nowrap">{train.arrival}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs whitespace-nowrap">Chỗ Đặt</p>
                    <p className="text-xs whitespace-nowrap">Chỗ Trống</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold whitespace-nowrap">100</p>
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
                    selectedCoach?.id === coach.id ? " bg-blue-500" : ""
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

              {/* 4-bed layout with price tooltip */}
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
                                  const price = calculateSeatPrice(
                                    selectedCoach.basePrice,
                                    seat,
                                    selectedCoach.type
                                  );
                                  return (
                                    <div key={seat} className="relative group">
                                      <Card
                                        className={`p-2 text-center cursor-pointer bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
                                          selectedCoach.bookedSeats.includes(
                                            seat
                                          )
                                            ? "bg-orange-600 text-white cursor-not-allowed"
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
                                  const price = calculateSeatPrice(
                                    selectedCoach.basePrice,
                                    seat,
                                    selectedCoach.type
                                  );
                                  return (
                                    <div key={seat} className="relative group">
                                      <Card
                                        className={`p-2 text-center cursor-pointer bg-cover bg-center h-[50px] w-[50px] flex items-center justify-center ${
                                          selectedCoach.bookedSeats.includes(
                                            seat
                                          )
                                            ? "bg-orange-600 text-white cursor-not-allowed"
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

              {/* Seat layout */}

              <div className="grid grid-cols-2 gap-4">
                {selectedCoach.type === "seat" &&
                  Array.from(
                    { length: selectedCoach.seats.length / 14 },
                    (_, partIndex) => {
                      const startIdx = partIndex * 14;
                      return (
                        <div
                          key={partIndex}
                          className="grid grid-cols-7 grid-rows-2 gap-2 border p-2 rounded-lg"
                        >
                          {selectedCoach.seats
                            .slice(startIdx, startIdx + 14)
                            .map((seat) => {
                              const price = calculateSeatPrice(
                                selectedCoach.basePrice,
                                seat,
                                selectedCoach.type
                              );
                              return (
                                <div key={seat} className="relative group">
                                  <Card
                                    className={`p-2 text-center cursor-pointer bg-cover bg-center h-[70px] w-[60px] ${
                                      selectedCoach.bookedSeats.includes(seat)
                                        ? "bg-orange-600 text-white cursor-not-allowed"
                                        : getCurrentSelectedSeats().includes(
                                            seat
                                          )
                                        ? "bg-[#a6b727] text-white"
                                        : "bg-transparent"
                                    }`}
                                    style={{
                                      backgroundImage: `url('/seat.png')`,
                                    }}
                                    onClick={() => toggleSeatSelection(seat)}
                                  >
                                    <h3 className="text-sm font-bold mt-3 text-white">
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
                      <span className="font-bold ">Toa: {item.coachId} -</span>{" "}
                      {item.coachName}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-sm">
                        <span className="font-bold ">Ghế:</span>{" "}
                        {item.seatNumber} -
                      </p>
                      <p className="text-sm ">
                        {" "}
                        <span className="font-bold">Giá:</span>{" "}
                        <span className="text-red-500 font-bold text-md">
                          {item.price} đ
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <p className="text-sm">
                        <span className="font-bold ">Khởi hành:</span>{" "}
                        {item.departure} -
                      </p>
                      <p className="text-sm">
                        {" "}
                        <span className="font-bold ">Đến: </span> {item.arrival}
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
                      timer: timer.toString(), // Pass the current timer value
                    }).toString();

                    router.push(`/payment?${query}`);
                    setCartItems([]);
                    setSelectedSeatsByCoach({});
                    // setTimer(0);
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
