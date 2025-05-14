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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CreateStationBody,
  CreateStationBodyType,
} from "@/schemaValidations/station.schema";
import { useToast } from "@/components/ui/use-toast";
import { useAddStationMutation } from "@/queries/useStation";

export default function AddStation() {
  const t = useTranslations("ManageStation");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const addStationMutation = useAddStationMutation();

  const form = useForm<CreateStationBodyType>({
    resolver: zodResolver(CreateStationBody),
    defaultValues: {
      stationName: "",
      position: 0,
    },
  });

  const onSubmit = async (data: CreateStationBodyType) => {
    try {
      await addStationMutation.mutateAsync(data);
      toast({
        title: t("AddSuccess"),
        description: t("StationAdded", { stationName: data.stationName }),
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: t("AddFailed"),
        description: t("Error_Generic"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>{t("AddStation")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("AddStation")}</DialogTitle>
          <DialogDescription>{t("AddStationDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="add-station-form"
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="stationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("StationName")}</FormLabel>
                  <FormControl>
                    <Input id="stationName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Position")}</FormLabel>
                  <FormControl>
                    <Input
                      id="position"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="add-station-form"
            disabled={addStationMutation.isPending}
          >
            {addStationMutation.isPending ? t("Submitting") : t("AddStation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
