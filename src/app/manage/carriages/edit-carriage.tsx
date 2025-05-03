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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { TrainDialog } from "./train-dialog";
import { CarriageTypesValues } from "@/constants/type";
import {
  useGetCarriage,
  useUpdateCarriageMutation,
} from "@/queries/useCarriage";
import {
  UpdateCarriageBody,
  UpdateCarriageBodyType,
} from "@/schemaValidations/carriage.schema";

type EditCarriageProps = {
  id: number;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditCarriage({
  id,
  setId,
  onSubmitSuccess,
}: EditCarriageProps) {
  const t = useTranslations("ManageCarriage");
  const { data } = useGetCarriage({
    id,
    enabled: Boolean(id),
  });
  const updateCarriageMutation = useUpdateCarriageMutation();

  const form = useForm<UpdateCarriageBodyType>({
    resolver: zodResolver(UpdateCarriageBody),
    defaultValues: {
      carriageType: "seat",
      discount: 0,
      price: 0,
      train: {
        trainId: 0,
        trainName: "",
      },
    },
  });

  const [selectedTrainName, setSelectedTrainName] = useState<string>("");

  useEffect(() => {
    if (data) {
      const { carriageType, discount, price, train } = data.payload.data;
      form.reset({
        carriageType,
        discount,
        price,
        train: {
          trainId: train.trainId,
          trainName: train.trainName,
        },
      });
      setSelectedTrainName(train.trainName);
    }
  }, [data, form]);

  const reset = () => {
    form.reset();
    setSelectedTrainName("");
    setId(undefined);
  };

  const onSubmit = async (values: UpdateCarriageBodyType) => {
    if (updateCarriageMutation.isPending) return;
    try {
      const body: UpdateCarriageBodyType & { id: number } = {
        id,
        ...values,
      };
      const result = await updateCarriageMutation.mutateAsync(body);
      toast({
        description: result.payload.message,
      });
      reset();
      if (onSubmitSuccess) onSubmitSuccess();
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
          <DialogTitle>{t("UpdateCarriage")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-carriage-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("Form errors:", e);
            })}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="train"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="train">{t("TrainNumber")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <div>{selectedTrainName || t("NoTrainSelected")}</div>
                        <TrainDialog
                          onChoose={(train) => {
                            form.setValue("train", train);
                            setSelectedTrainName(train.trainName);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">{t("Price")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="price"
                          type="number"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          value={field.value}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="discount">{t("Discount")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="discount"
                          type="number"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          value={field.value}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-carriage-form">
            {t("UpdateCarriage")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
