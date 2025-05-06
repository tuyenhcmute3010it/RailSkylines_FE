// src/components/promotion/add-promotion-dialog.tsx
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  CreatePromotionBody,
  CreatePromotionBodyType,
  PROMOTION_STATUS_ENUM,
} from "@/schemaValidations/promotion.schema";
import { useAddPromotionMutation } from "@/queries/usePromotion";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils"; // Assuming this utility exists
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

export default function AddPromotionDialog() {
  const t = useTranslations("ManagePromotion"); // Assuming a relevant translation namespace
  const [open, setOpen] = useState(false);

  const form = useForm<CreatePromotionBodyType>({
    resolver: zodResolver(CreatePromotionBody),
    defaultValues: {
      promotionName: "",
      promotionCode: "",
      promotionDescription: "",
      discount: 0,
      startDate: new Date().toISOString().slice(0, 16), // Default to now, for datetime-local
      validity: new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .slice(0, 16), // Default to 7 days from now
      // status: "inactive", // Optional: BE can determine this based on dates
    },
  });

  const addPromotionMutation = useAddPromotionMutation();

  const resetForm = () => {
    form.reset();
  };

  const onSubmit = async (values: CreatePromotionBodyType) => {
    if (addPromotionMutation.isPending) return;
    try {
      // Convert dates to full ISO string if your BE expects Instant correctly
      const payload = {
        ...values,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : undefined,
        validity: new Date(values.validity).toISOString(),
      };
      const result = await addPromotionMutation.mutateAsync(payload);
      toast({
        title: t("Success"),
        description: t("PromotionAddedSuccessfully"), // Adjust translation key
      });
      resetForm();
      setOpen(false);
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
        duration: 5000,
      });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>{t("AddPromotion")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("AddPromotion")}</DialogTitle>
          <DialogDescription>{t("AddPromotionDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-promotion-form"
            className="grid gap-4 py-4"
            onReset={resetForm}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="promotionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("PromotionName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("EnterPromotionName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotionCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("PromotionCode")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("EnterPromotionCode")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotionDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Description")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("EnterDescription")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("DiscountPercentage")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 10 for 10%"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("StartDate")}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ValidityDate")}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
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
                      {PROMOTION_STATUS_ENUM.map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(status)}{" "}
                          {/* Assuming you have translations for status values */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("StatusDescription")}{" "}
                    {/* e.g. Status will be auto-updated based on dates if not set. */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            form="add-promotion-form"
            disabled={addPromotionMutation.isPending}
          >
            {addPromotionMutation.isPending
              ? t("Adding...")
              : t("AddPromotion")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
