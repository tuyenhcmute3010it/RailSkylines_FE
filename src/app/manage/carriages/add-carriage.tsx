"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { TrainDialog } from "./train-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateCarriageBody,
  CreateCarriageBodyType,
} from "@/schemaValidations/carriage.schema";
import { CarriageTypes, CarriageTypesValues } from "@/constants/type";
import { useAddCarriageMutation } from "@/queries/useCarriage";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrainSchema } from "@/schemaValidations/train.schema";

export default function AddCarriage() {
  const [open, setOpen] = useState(false);
  const [selectedTrainName, setSelectedTrainName] = useState<string>(""); // Track train name for display
  const form = useForm<CreateCarriageBodyType>({
    resolver: zodResolver(CreateCarriageBody),
    defaultValues: {
      carriageType: CarriageTypes.SixBeds,
      discount: 0,
      price: 0,
      train: {
        trainId: 0,
        trainName: "",
      },
    },
  });
  const addCarriageMutation = useAddCarriageMutation();

  const reset = () => {
    form.reset();
    setSelectedTrainName("");
  };

  const onSubmit = async (values: CreateCarriageBodyType) => {
    console.log(values);
    if (!values.train) {
      form.setError("train", { message: "Please select a train" });
      return;
    }
    if (addCarriageMutation.isPending) return;
    try {
      const body = values;
      const result = await addCarriageMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Carriage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Carriage</DialogTitle>
          <DialogDescription>
            Enter the details of the new carriage.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-carriage-form"
            className="grid gap-4 py-4"
            onReset={reset}
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("Form errors:", e);
            })}
          >
            <FormField
              control={form.control}
              name="carriageType"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel htmlFor="carriageType">
                      Type of Carriage
                    </FormLabel>
                    <div className="col-span-3 w-full space-y-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Type Carriage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CarriageTypesValues.map((carriageType) => (
                            <SelectItem key={carriageType} value={carriageType}>
                              {carriageType}
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
            <FormField
              control={form.control}
              name="train"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel htmlFor="train">Choose Train</FormLabel>
                    <div className="col-span-3 w-full space-y-2">
                      <div>{selectedTrainName || "No train selected"}</div>
                      <TrainDialog
                        onChoose={(train) => {
                          form.setValue("train", train);
                          setSelectedTrainName(train.trainName);
                        }}
                      />
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="discount">Discount (%)</FormLabel>
                  <Input
                    id="discount"
                    type="string"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="price">Price</FormLabel>
                  <Input
                    id="price"
                    type="string"
                    // value={field.value}
                    // {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-carriage-form">
            Add Carriage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
