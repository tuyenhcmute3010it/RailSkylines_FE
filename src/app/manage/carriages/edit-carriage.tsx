"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrainDialog } from "./train-dialog";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

// Định nghĩa type cho Carriage
type Carriage = {
  id: number;
  carriageNumber: string;
  trainNumber: string;
  capacity: number;
  type: string;
};

type EditCarriageProps = {
  id?: number;
  setId?: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditCarriage({
  id,
  setId,
  onSubmitSuccess,
}: EditCarriageProps) {
  const manageCarriageT = useTranslations("ManageCarriage");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy carriageId từ props hoặc query params
  const carriageId = id || Number(searchParams.get("id"));
  const [open, setOpen] = useState(!!carriageId);

  // Dữ liệu mẫu (thay bằng API call trong thực tế)
  const [carriageData, setCarriageData] = useState<Carriage | null>(null);

  const form = useForm({
    defaultValues: {
      trainNumber: "",
      carriageNumber: "",
      capacity: "",
      type: "",
    },
  });

  const CarriageTypes = [
    { value: "soft_seat_ac", label: "Soft Seat with AC" },
    { value: "hard_seat", label: "Hard Seat" },
    { value: "soft_bed_6", label: "Soft Berth (6 Beds)" },
    { value: "soft_bed_4", label: "Soft Berth (4 Beds)" },
  ];

  // Giả lập fetch dữ liệu carriage dựa trên id
  useEffect(() => {
    if (carriageId) {
      // Thay bằng API call thực tế: fetch(`/api/carriages/${carriageId}`)
      const mockData: Carriage = {
        id: carriageId,
        carriageNumber: `C00${carriageId}`,
        trainNumber: `SE${carriageId}`,
        capacity: 50 + carriageId * 10,
        type: CarriageTypes[carriageId % 4].value,
      };
      setCarriageData(mockData);
      form.reset({
        carriageNumber: mockData.carriageNumber,
        trainNumber: mockData.trainNumber,
        capacity: mockData.capacity.toString(),
        type: mockData.type,
      });
    }
  }, [carriageId, form]);

  const onSubmit = (data: any) => {
    // Xử lý submit form (gọi API để cập nhật carriage)
    console.log("Updated carriage:", { id: carriageId, ...data });

    // Sau khi submit thành công
    setOpen(false);
    if (setId) setId(undefined); // Đóng dialog nếu dùng props
    if (onSubmitSuccess) onSubmitSuccess();
    router.push("/manage/carriages"); // Chuyển hướng về danh sách
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && setId) setId(undefined);
        if (!value) router.push("/manage/carriages");
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          Edit Carriage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="edit-carriage-form"
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="carriageNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{manageCarriageT("CarriageNumber")}</FormLabel>
                  <Input id="carriageNumber" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trainNumber"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel>{manageCarriageT("TrainNumber")}</FormLabel>
                    <div className="col-span-3 w-full space-y-2">
                      <div className="flex items-center gap-4">
                        <div>{field.value}</div>
                        <TrainDialog
                          onChoose={(train) => {
                            field.onChange(train.name);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{manageCarriageT("Capacity")}</FormLabel>
                  <Input id="capacity" type="number" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel>{manageCarriageT("Type")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="col-span-3">
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Type Carriage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CarriageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-carriage-form">
            {manageCarriageT("UpdateCarriage")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
