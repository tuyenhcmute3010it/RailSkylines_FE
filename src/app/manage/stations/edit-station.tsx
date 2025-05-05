"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetStation, useUpdateStationMutation } from "@/queries/useStation";
import {
  UpdateStationBody,
  UpdateStationBodyType,
} from "@/schemaValidations/station.schema";
import { useToast } from "@/components/ui/use-toast";
import { useGetCarriage } from "@/queries/useCarriage";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AlertDialogTitle } from "@/components/ui/alert-dialog";

type EditStationProps = {
  id: number;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditStation({
  id,
  setId,
  onSubmitSuccess,
}: EditStationProps) {
  const t = useTranslations("ManageStation");
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get station ID from props or query params
  const stationId = id || Number(searchParams.get("id"));
  const [open, setOpen] = useState(!!stationId);

  // Fetch station data
  const { data } = useGetStation({
    id,
    enabled: Boolean(id),
  });

  const updateStationMutation = useUpdateStationMutation();

  const form = useForm<UpdateStationBodyType>({
    resolver: zodResolver(UpdateStationBody),
    defaultValues: {
      stationName: "",
      position: 0,
    },
  });

  useEffect(() => {
    if (data) {
      const { stationName, position } = data.payload.data;
      form.reset({
        stationName,
        position,
      });
    }
  }, [data, form]);
  const onSubmit = async (data: UpdateStationBodyType) => {
    try {
      await updateStationMutation.mutateAsync({ id: stationId, ...data });
      toast({
        title: t("UpdateSuccess"),
        description: t("StationUpdated", { stationName: data.stationName }),
      });
      setOpen(false);
      if (setId) setId(undefined);
      if (onSubmitSuccess) onSubmitSuccess();
      router.push("/manage/stations");
    } catch (error) {
      toast({
        title: t("UpdateFailed"),
        description: t("Error_Generic"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && setId) setId(undefined);
        if (!value) router.push("/manage/stations");
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          {t("EditStation")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("UpdateStation")}</DialogTitle>
          <DialogDescription>{t("UpdateStationDescription")}</DialogDescription>
        </DialogHeader>
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="edit-station-form"
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
              form="edit-station-form"
              disabled={updateStationMutation.isPending}
            >
              {updateStationMutation.isPending
                ? t("Submitting")
                : t("UpdateStation")}
            </Button>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}
