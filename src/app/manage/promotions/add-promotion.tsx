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

export default function AddPromotion() {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      promotionName: "",
      discount: "",
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Promotion</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Promotion</DialogTitle>
          <DialogDescription>
            Enter the details of the new promotion.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate id="add-carriage-form" className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="promotionName"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="promotionName">Promotion Name</Label>
                  <Input id="promotionName" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="promotionName">Discount</Label>
                  <Input id="promotionName" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-carriage-form">
            Add Promotion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
