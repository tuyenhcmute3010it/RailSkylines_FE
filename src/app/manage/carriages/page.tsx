"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddCarriage from "./add-carriage";

interface TrainCar {
  id: number;
  name: string;
  seats: number;
}

const initialTrainCars: TrainCar[] = [
  { id: 1, name: "Toa A", seats: 50 },
  { id: 2, name: "Toa B", seats: 40 },
  { id: 3, name: "Toa C", seats: 45 },
];

export default function TrainCarManagement() {
  const [trainCars, setTrainCars] = useState<TrainCar[]>(initialTrainCars);

  const deleteTrainCar = (id: number) => {
    setTrainCars(trainCars.filter((car) => car.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">🚆 Train Car Management</h1>

      {/* Nút chuyển đến trang thêm toa tàu */}
      <AddCarriage />
      {/* Bảng danh sách toa tàu */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainCars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>{car.name}</TableCell>
              <TableCell>{car.seats}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => deleteTrainCar(car.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
