// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useState } from "react";
// import { PlusCircle } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { toast } from "@/components/ui/use-toast";
// import { handleErrorApi } from "@/lib/utils";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useTranslations } from "next-intl";
// import {
//   CreatePromotionBody,
//   CreatePromotionBodyType,
//   PROMOTION_STATUSES,
// } from "@/schemaValidations/promotion.schema";
// import { useAddPromotionMutation } from "@/queries/usePromotion";

// export default function AddPromotion() {
//   const t = useTranslations("ManagePromotion");
//   const [open, setOpen] = useState(false);
//   const form = useForm<CreatePromotionBodyType>({
//     resolver: zodResolver(CreatePromotionBody),
//     defaultValues: {
//       promotionCode: "",
//       promotionDescription: "",
//       promotionName: "",
//       discount: 0,
//       startDate: new Date().toISOString().slice(0, 16),
//       validity: new Date().toISOString().slice(0, 16),
//       status: "inactive",
//     },
//   });
//   const addPromotionMutation = useAddPromotionMutation();

//   const reset = () => {
//     form.reset();
//   };

//   const onSubmit = async (values: CreatePromotionBodyType) => {
//     if (addPromotionMutation.isPending) return;
//     try {
//       const result = await addPromotionMutation.mutateAsync({
//         ...values,
//         discount: Number(values.discount),
//         startDate: new Date(values.startDate).toISOString(),
//         validity: new Date(values.validity).toISOString(),
//       });
//       toast({
//         description: result.payload.message,
//       });
//       reset();
//       setOpen(false);
//     } catch (error) {
//       handleErrorApi({
//         error,
//         setError: form.setError,
//       });
//     }
//   };

//   return (
//     <Dialog onOpenChange={setOpen} open={open}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="h-7 gap-1">
//           <PlusCircle className="h-3.5 w-3.5" />
//           <span>{t("AddPromotion")}</span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>{t("AddPromotion")}</DialogTitle>
//           <DialogDescription>{t("AddPromotionDes")}</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             id="add-promotion-form"
//             className="grid gap-4 py-4"
//             onReset={reset}
//             onSubmit={form.handleSubmit(onSubmit, (e) => {
//               console.log("Form errors:", e);
//             })}
//           >
//             <FormField
//               control={form.control}
//               name="promotionCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("PromotionCode")}</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder={t("PromotionCodePlaceholder")}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="promotionDescription"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("PromotionDescription")}</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder={t("PromotionDescriptionPlaceholder")}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="promotionName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("PromotionName")}</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder={t("PromotionNamePlaceholder")}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="discount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("Discount")}</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       placeholder={t("DiscountPlaceholder")}
//                       {...field}
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="startDate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("StartDate")}</FormLabel>
//                   <FormControl>
//                     <Input type="datetime-local" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="validity"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("Validity")}</FormLabel>
//                   <FormControl>
//                     <Input type="datetime-local" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="status"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>{t("Status")}</FormLabel>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder={t("SelectStatus")} />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {PROMOTION_STATUSES.map((status) => (
//                         <SelectItem key={status} value={status}>
//                           {status}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button type="submit" form="add-promotion-form">
//             {t("AddPromotion")}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
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
import {
  CreatePromotionBody,
  CreatePromotionBodyType,
} from "@/schemaValidations/promotion.schema";
import { useAddPromotionMutation } from "@/queries/usePromotion";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { PROMOTION_STATUSES } from "@/schemaValidations/promotion.schema";

export default function AddPromotion() {
  const t = useTranslations("ManagePromotion");
  const [open, setOpen] = useState(false);
  const form = useForm<CreatePromotionBodyType>({
    resolver: zodResolver(CreatePromotionBody),
    defaultValues: {
      promotionCode: "",
      promotionDescription: "",
      promotionName: "",
      discount: 0,
      startDate: new Date().toISOString().slice(0, 16),
      validity: new Date().toISOString().slice(0, 16),
      status: "inactive",
    },
  });
  const addPromotionMutation = useAddPromotionMutation();

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (values: CreatePromotionBodyType) => {
    if (addPromotionMutation.isPending) return;
    try {
      const result = await addPromotionMutation.mutateAsync({
        ...values,
        discount: Number(values.discount),
      });
      toast({
        description: result.payload.message,
      });
      reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span>{t("AddPromotion")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("AddPromotion")}</DialogTitle>
          <DialogDescription>{t("AddPromotionDes")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-promotion-form"
            className="grid gap-4 py-4"
            onReset={reset}
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("Form errors:", e);
            })}
          >
            <FormField
              control={form.control}
              name="promotionCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("PromotionCode")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("PromotionCodePlaceholder")}
                      {...field}
                    />
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
                  <FormLabel>{t("PromotionDescription")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("PromotionDescriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="promotionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("PromotionName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("PromotionNamePlaceholder")}
                      {...field}
                    />
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
                  <FormLabel>{t("Discount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={t("DiscountPlaceholder")}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel>{t("Validity")}</FormLabel>
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
                        <SelectValue placeholder={t("SelectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROMOTION_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-promotion-form">
            {t("AddPromotion")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
