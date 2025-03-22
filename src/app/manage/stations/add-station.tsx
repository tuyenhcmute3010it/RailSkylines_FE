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

export default function AddStation() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      stationName: "",
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Station</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Station</DialogTitle>
          <DialogDescription>
            Enter the details of the new carriage.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate id="add-carriage-form" className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="stationName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="stationName">Station Name</Label>
                  <Input id="stationName" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-carriage-form">
            Add Station
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
