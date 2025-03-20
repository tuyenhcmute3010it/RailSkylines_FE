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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

export default function AddCarriage() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      carriageNumber: "",
      capacity: "",
      type: "",
    },
  });

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
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="capacity">Capacity</Label>
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
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" {...field} />
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
