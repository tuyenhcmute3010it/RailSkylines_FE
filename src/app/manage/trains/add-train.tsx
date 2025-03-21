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
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddTrain() {
  const [open, setOpen] = useState(false);
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
          <form noValidate id="add-carriage-form" className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="carriageNumber"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="carriageNumber">Carriage Number</Label>
                  <Input id="carriageNumber" {...field} />
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
                    <FormLabel>Type of Carriage</FormLabel>
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
          <Button type="submit" form="add-carriage-form">
            Add Carriage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
