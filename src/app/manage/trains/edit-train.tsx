"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  getTableLink,
  getVietnameseTableStatus,
  handleErrorApi,
} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  TableStatus,
  TableStatusValues,
  TrainStatus,
  TrainStatusValues,
} from "@/constants/type";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import QRCodeTable from "@/components/qrcode-table";
import { useGetTrain, useUpdateTrainMutation } from "@/queries/useTrain";
import {
  UpdateTrainBody,
  UpdateTrainBodyType,
} from "@/schemaValidations/train.schema";

export default function EditTrain({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const { data } = useGetTrain({
    id: id as number,
    enabled: Boolean(id),
  });
  const updateTrainMutation = useUpdateTrainMutation();

  const form = useForm<UpdateTrainBodyType>({
    resolver: zodResolver(UpdateTrainBody),
    defaultValues: {
      trainName: "",
      trainStatus: TrainStatus.Active,
    },
  });
  const reset = () => {
    setId(undefined);
  };
  const [trainNumber, setTrainNumber] = useState(0);
  const [trainName, setTrainName] = useState("");
  const [trainStatus, setTrainStatus] = useState("");
  useEffect(() => {
    if (data) {
      const { trainId, trainName, trainStatus } = data.payload.data;
      console.log(data.payload.data);
      console.log("Dữ liệu reset:", {
        trainName,
        trainStatus,
      });
      form.reset({
        trainName,
        trainStatus,
      });
      setTrainNumber(trainId);
      setTrainName(trainName);
      setTrainStatus(trainStatus);
    }
  }, [data, form]);
  const onSubmit = async (values: UpdateTrainBodyType) => {
    if (updateTrainMutation.isPending) return;
    try {
      const body: UpdateTrainBodyType & { id: number } = {
        id: id as number,
        ...values,
      };
      const result = await updateTrainMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      reset();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };
  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          form.reset();
          setId(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>Update Train</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-table-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
            })}
          >
            <div className="grid gap-4 py-4">
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label htmlFor="name">Train Number</Label>
                  <div className="col-span-3 w-full space-y-2">
                    <Input
                      id="number"
                      type="number"
                      className="w-full"
                      value={trainNumber}
                      readOnly
                    />
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
              <FormField
                control={form.control}
                name="trainName"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Train Name</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="trainName"
                          className="w-full"
                          // value={trainName}
                          {...field}
                          type="string"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trainStatus"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TrainStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-table-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
