// src/components/promotion/edit-promotion-dialog.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useEffect } from "react";
import {
  UpdatePromotionBody,
  UpdatePromotionBodyType,
  PROMOTION_STATUS_ENUM,
  PromotionSchemaType, // This is the type for promotionData.payload.data
} from "@/schemaValidations/promotion.schema";
import {
  useGetPromotion,
  useUpdatePromotionMutation,
} from "@/queries/usePromotion";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

type EditPromotionDialogProps = {
  promotionId: number | undefined;
  setPromotionId: (id: number | undefined) => void;
  onSuccess?: () => void;
};

// Define the deeply nested structure for a single promotion's response data
type DeeplyWrappedSinglePromotionData = {
  payload: {
    data: PromotionSchemaType;
    message?: string; // Example of other fields that might be in payload
    statusCode?: number; // Example
  };
  status?: number; // Example of top-level http status
  // Add other top-level fields if your http client/wrapper includes them
};

export default function EditPromotionDialog({
  promotionId,
  setPromotionId,
  onSuccess,
}: EditPromotionDialogProps) {
  const t = useTranslations("ManagePromotion");
  const isOpen = Boolean(promotionId);

  const {
    data: promotionResponse, // Renamed to promotionResponse for clarity
    isLoading: isFetchingPromotion,
    isError,
    error,
  } = useGetPromotion({
    id: promotionId as number,
    enabled: isOpen && typeof promotionId === "number",
  });

  const form = useForm<UpdatePromotionBodyType>({
    resolver: zodResolver(UpdatePromotionBody),
    defaultValues: {
      promotionName: "",
      promotionCode: "",
      promotionDescription: "",
      discount: 0,
      startDate: "",
      validity: "",
      status: "inactive",
    },
  });

  useEffect(() => {
    if (isOpen && promotionResponse) {
      let actualPromotionData: PromotionSchemaType | null = null;

      // Check for the new deeply nested structure: response.payload.data
      if (
        typeof promotionResponse === "object" &&
        promotionResponse !== null &&
        (promotionResponse as DeeplyWrappedSinglePromotionData).payload &&
        typeof (promotionResponse as DeeplyWrappedSinglePromotionData)
          .payload === "object" &&
        (promotionResponse as DeeplyWrappedSinglePromotionData).payload.data
      ) {
        actualPromotionData = (
          promotionResponse as DeeplyWrappedSinglePromotionData
        ).payload.data;
      }
      // Fallback: Check for previous structure: response.payload (if data is directly in payload)
      else if (
        typeof promotionResponse === "object" &&
        promotionResponse !== null &&
        (promotionResponse as any).payload && // Assuming payload directly contains PromotionSchemaType
        typeof (promotionResponse as any).payload.promotionId !== "undefined" // Check for a key field
      ) {
        actualPromotionData = (promotionResponse as any)
          .payload as PromotionSchemaType;
        console.warn(
          "EditPromotionDialog: Used fallback structure response.payload"
        );
      }
      // Fallback: Check if promotionResponse is the direct data (no wrappers)
      else if (
        typeof promotionResponse === "object" &&
        promotionResponse !== null &&
        typeof (promotionResponse as PromotionSchemaType).promotionId !==
          "undefined" // Check for a key field
      ) {
        actualPromotionData = promotionResponse as PromotionSchemaType;
        console.warn(
          "EditPromotionDialog: Used fallback structure - direct data"
        );
      }

      if (actualPromotionData) {
        form.reset({
          promotionName: actualPromotionData.promotionName,
          promotionCode: actualPromotionData.promotionCode,
          promotionDescription: actualPromotionData.promotionDescription || "",
          discount: actualPromotionData.discount,
          startDate: actualPromotionData.startDate
            ? new Date(actualPromotionData.startDate).toISOString().slice(0, 16)
            : "",
          validity: actualPromotionData.validity
            ? new Date(actualPromotionData.validity).toISOString().slice(0, 16)
            : "",
          status: actualPromotionData.status,
        });
      } else if (promotionResponse) {
        // Data exists but not in a recognized format
        console.error(
          "EditPromotionDialog: promotionResponse is present but not in expected format.",
          promotionResponse
        );
        toast({
          variant: "destructive",
          title: t("Error"),
          description: t("FailedToParsePromotionData"),
        });
      }
    }
  }, [isOpen, promotionResponse, form, t]);

  const updatePromotionMutation = useUpdatePromotionMutation();

  const handleResetAndClose = () => {
    form.reset(form.formState.defaultValues);
    setPromotionId(undefined);
  };

  const onSubmit = async (values: UpdatePromotionBodyType) => {
    if (updatePromotionMutation.isPending || !promotionId) return;
    try {
      const payloadToSubmit = {
        ...values,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : undefined,
        validity: new Date(values.validity).toISOString(),
      };
      await updatePromotionMutation.mutateAsync({
        id: promotionId,
        ...payloadToSubmit,
      });
      toast({
        title: t("Success"),
        description: t("PromotionUpdatedSuccessfully"),
      });
      handleResetAndClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
        duration: 5000,
      });
    }
  };

  if (isOpen && isError) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => !open && handleResetAndClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {t("ErrorFetchingPromotion")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t("CouldNotLoadPromotionDetails")}</p>
            {error && (
              <p className="text-sm text-muted-foreground mt-2">
                {(error as any).message || t("UnknownError")}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetAndClose}
            >
              {t("Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleResetAndClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("EditPromotion")}</DialogTitle>
          <DialogDescription>{t("EditPromotionDescription")}</DialogDescription>
        </DialogHeader>
        {isFetchingPromotion && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {!isFetchingPromotion && (
          <Form {...form}>
            <form
              id="edit-promotion-form"
              className="grid gap-4 py-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="promotionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("PromotionName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                        {...field}
                        value={
                          field.value === null ||
                          typeof field.value === "undefined"
                            ? ""
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value) || 0
                          )
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("SelectStatusPlaceholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROMOTION_STATUS_ENUM.map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>{t("StatusDescription")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleResetAndClose}>
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            form="edit-promotion-form"
            disabled={updatePromotionMutation.isPending || isFetchingPromotion}
          >
            {updatePromotionMutation.isPending
              ? t("Saving...")
              : t("SaveChanges")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
