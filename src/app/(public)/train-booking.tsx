// "use client";
// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const seats = Array.from({ length: 64 }, (_, i) => i + 1);
// const bookedSeats = [
//   1, 2, 3, 6, 7, 8, 9, 10, 14, 15, 16, 18, 19, 20, 21, 23, 24,
// ];

// export default function TrainTicketBooking() {
//   const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

//   const toggleSeatSelection = (seat: number) => {
//     if (bookedSeats.includes(seat)) return;
//     setSelectedSeats((prev) =>
//       prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
//     );
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Toa số 1: Ngồi mềm điều hòa</h2>
//       <div className="grid grid-cols-8 gap-2">
//         {seats.map((seat) => (
//           <Card
//             key={seat}
//             className={`p-2 text-center cursor-pointer ${
//               bookedSeats.includes(seat)
//                 ? "bg-red-500 text-white cursor-not-allowed"
//                 : selectedSeats.includes(seat)
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-100"
//             }`}
//             onClick={() => toggleSeatSelection(seat)}
//           >
//             <CardContent>{seat}</CardContent>
//           </Card>
//         ))}
//       </div>
//       <div className="mt-4">
//         <Button
//           className="bg-green-600 text-white"
//           disabled={selectedSeats.length === 0}
//         >
//           Xác nhận đặt chỗ ({selectedSeats.length} ghế)
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Danh sách tàu với các khoang và ghế đặt trước
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
        name: "Toa số 1: Ngồi mềm điều hòa",
        seats: Array.from({ length: 64 }, (_, i) => i + 1),
        bookedSeats: [
          1, 2, 3, 6, 7, 8, 9, 10, 14, 15, 16, 18, 19, 20, 21, 23, 24,
        ],
      },
      {
        id: 2,
        name: "Toa số 2: Ngồi cứng điều hòa",
        seats: Array.from({ length: 64 }, (_, i) => i + 1),
        bookedSeats: [4, 5, 11, 12, 17, 22, 25, 26, 30, 31],
      },
      {
        id: 3,
        name: "Toa số 3: Ngồi cứng điều hòa",
        seats: Array.from({ length: 64 }, (_, i) => i + 1),
        bookedSeats: [4, 5, 11, 12, 17, 22, 25, 26, 30, 31],
      },
      {
        id: 4,
        name: "Toa số 4: Ngồi cứng điều hòa",
        seats: Array.from({ length: 64 }, (_, i) => i + 1),
        bookedSeats: [4, 5, 11, 12, 17, 22, 25, 26, 30, 31],
      },
      {
        id: 5,
        name: "Toa số 5: Ngồi cứng điều hòa",
        seats: Array.from({ length: 64 }, (_, i) => i + 1),
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
        name: "Toa số 1: Giường nằm khoang 4",
        seats: Array.from({ length: 36 }, (_, i) => i + 1),
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
        name: "Toa số 1: Giường nằm khoang 6",
        seats: Array.from({ length: 42 }, (_, i) => i + 1),
        bookedSeats: [2, 4, 7, 11, 14, 17, 19, 21, 26, 30, 35],
      },
      {
        id: 2,
        name: "Toa số 2: Ngồi cứng điều hòa",
        seats: Array.from({ length: 64 }, (_, i) => i + 1),
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
        name: "Toa số 1: Ngồi mềm điều hòa",
        seats: Array.from({ length: 64 }, (_, i) => i + 1),
        bookedSeats: [1, 6, 9, 15, 19, 21, 29, 34, 40, 48, 53, 58, 60],
      },
      {
        id: 2,
        name: "Toa số 2: Giường nằm khoang 4",
        seats: Array.from({ length: 36 }, (_, i) => i + 1),
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
        name: "Toa số 1: Giường nằm khoang 6",
        seats: Array.from({ length: 42 }, (_, i) => i + 1),
        bookedSeats: [3, 7, 12, 16, 20, 24, 29, 32, 38, 40],
      },
      {
        id: 2,
        name: "Toa số 2: Ngồi cứng điều hòa",
        seats: Array.from({ length: 64 }, (_, i) => i + 1),
        bookedSeats: [5, 8, 15, 22, 28, 33, 39, 44, 51, 55],
      },
    ],
  },
];

export default function TrainTicketBooking() {
  const [selectedTrain, setSelectedTrain] = useState<(typeof trains)[0] | null>(
    null
  );
  const [selectedCoach, setSelectedCoach] = useState<
    (typeof trains)[0]["carriages"][0] | null
  >(null);

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  // Xử lý chọn tàu
  const handleTrainSelect = (trainId: string) => {
    const train = trains.find((t) => t.id === trainId) || null; // Nếu không tìm thấy thì gán null
    setSelectedTrain(train);
    setSelectedCoach(null);
    setSelectedSeats([]);
  };

  // Xử lý chọn khoang
  const handleCoachSelect = (coachId: number) => {
    if (!selectedTrain) return;

    const coach = selectedTrain.carriages.find((c) => c.id === coachId) || null;
    setSelectedCoach(coach);
    setSelectedSeats([]);
  };

  // Xử lý chọn ghế
  const toggleSeatSelection = (seat: number) => {
    if (!selectedCoach) return;
    if (selectedCoach.bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Chọn tàu</h2>
      <div className="grid grid-cols-5 gap-4">
        {trains.map((train) => (
          <Card
            key={train.id}
            className={`relative p-4 text-center cursor-pointer flex flex-col justify-center items-center h-[250px] w-[200px] bg-cover bg-center border-none ${
              selectedTrain?.id === train.id ? "bg-blue-500" : "bg-transparent"
            }`}
            style={{
              backgroundImage: `url('/head-train3.png')`,
            }} // Đặt ảnh tàu làm nền
            onClick={() => handleTrainSelect(train.id)}
          >
            {/* Lớp mờ để tăng độ tương phản */}
            <div className="absolute inset-0"></div>

            <CardContent className="relative z-10 text-black top-[-32px]">
              <h3 className="text-lg font-bold p-1 w-fit inline-block">
                {train.name}
              </h3>
              <div className="flex justify-between items-center mt-5">
                <p className="text-sm whitespace-nowrap font-bold">TG đi :</p>
                <p className="whitespace-nowrap">{train.departure}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm whitespace-nowrap font-bold">TG đến :</p>
                <p className="whitespace-nowrap">{train.arrival}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs whitespace-nowrap ">Chỗ Đặt</p>
                <p className="text-xs whitespace-nowrap">Chỗ Trống</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold whitespace-nowrap ">100</p>
                <p className="text-lg font-bold whitespace-nowrap">
                  {train.availableSeats}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* 
      {selectedTrain && (
        <>
          <div className="grid grid-cols-5 gap-4 mt-3">
            {selectedTrain.carriages.map((coach) => (
              <Card
                key={coach.id}
                className={`p-4 text-center cursor-pointer ${
                  selectedCoach?.id === coach.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => handleCoachSelect(coach.id)}
              >
                <CardContent>
                  <h3 className="text-sm font-bold">{coach.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )} */}
      {selectedTrain && (
        <>
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
                  selectedCoach?.id === coach.id
                    ? "border-2 border-yellow-500 bg-blue-500"
                    : ""
                }`}
                style={{
                  backgroundImage: `url('/carriage.png')`, // Thay ảnh tương ứng
                }}
                onClick={() => handleCoachSelect(coach.id)}
              >
                {/* Lớp phủ mờ để giúp chữ dễ đọc hơn */}

                {/* <CardContent className="relative z-10 text-white">
                </CardContent> */}
                <h3 className="text-sm font-bold mt-3 text-white">
                  {coach.id}
                </h3>
              </Card>
            ))}
          </div>
        </>
      )}

      {selectedCoach && (
        <>
          <h2 className="text-xl font-bold mt-6">{selectedCoach.name}</h2>
          <div className="grid grid-cols-8 gap-2">
            {selectedCoach.seats.map((seat) => (
              <Card
                key={seat}
                className={`p-2 text-center cursor-pointer bg-cover bg-center h-[70px] w-[60px] ${
                  selectedCoach.bookedSeats.includes(seat)
                    ? "bg-orange-600 text-white cursor-not-allowed"
                    : selectedSeats.includes(seat)
                    ? "bg-[#a6b727] text-white"
                    : "bg-transparent"
                }`}
                style={{
                  backgroundImage: `url('/seat.png')`, // Thay ảnh tương ứng
                }}
                onClick={() => toggleSeatSelection(seat)}
              >
                <h3 className="text-sm font-bold mt-3 text-white">{seat}</h3>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
