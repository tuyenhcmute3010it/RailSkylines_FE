"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateSeatMutation } from "@/queries/useSeat"; // Assuming the mutation hooks are in a file like useSeat.ts
import {
  UpdateSeatBodyType,
  SeatSchemaType,
  UpdateSeatBody,
} from "@/schemaValidations/seat.schema";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { SeatStatusValues, SeatTypeValues } from "@/constants/type";

interface UpdateSeatProps {
  seat: SeatSchemaType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UpdateSeat({
  seat,
  open,
  onOpenChange,
  onSuccess,
}: UpdateSeatProps) {
  const t = useTranslations("ManageSeat");
  const { toast } = useToast();
  const updateSeatMutation = useUpdateSeatMutation();

  // Initialize form with Zod schema and default values
  const form = useForm<UpdateSeatBodyType>({
    resolver: zodResolver(UpdateSeatBody),
    defaultValues: {
      seatStatus: seat.seatStatus,
      price: seat.price,
      seatType: seat.seatType,
      ticket: seat.ticket ? { ticketId: seat.ticket.ticketId } : undefined,
    },
  });

  // Reset form when seat changes
  useEffect(() => {
    form.reset({
      seatStatus: seat.seatStatus,
      price: seat.price,
      seatType: seat.seatType,
      ticket: seat.ticket ? { ticketId: seat.ticket.ticketId } : undefined,
    });
  }, [seat, form]);

  // Handle form submission
  const onSubmit = async (values: UpdateSeatBodyType) => {
    try {
      await updateSeatMutation.mutateAsync({
        id: seat.seatId,
        ...values,
      });
      toast({
        title: t("UpdateSuccess"),
        description: t("SeatUpdated"),
      });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: t("UpdateFailed"),
        description: t("Error_Generic"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("UpdateSeat")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-seat-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("Form errors:", e);
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Price")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t("Price")}
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seatStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Status")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("SelectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SeatStatusValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`Status_${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("Cancel")}
              </Button>
              <Button type="submit" form="edit-seat-form">
                {t("Update")}
                {/* {updateSeatMutation.isPending ? t("Updating") : t("Update")} */}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
