// // "use client";

// // import { Button } from "@/components/ui/button";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogFooter,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { useForm } from "react-hook-form";
// // import { useState, useEffect } from "react";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { useTranslations } from "next-intl";
// // import { useRouter, useSearchParams } from "next/navigation";

// // // Định nghĩa type cho Promotion
// // type Promotion = {
// //   id: number;
// //   promotionName: string;
// //   discount: number;
// // };

// // type EditPromotionProps = {
// //   id?: number;
// //   setId?: (value: number | undefined) => void;
// //   onSubmitSuccess?: () => void;
// // };

// // export default function EditPromotion({
// //   id,
// //   setId,
// //   onSubmitSuccess,
// // }: EditPromotionProps) {
// //   const manageCarriageT = useTranslations("ManageCarriage");
// //   const searchParams = useSearchParams();
// //   const router = useRouter();

// //   // Lấy promotionId từ props hoặc query params
// //   const promotionId = id || Number(searchParams.get("id"));
// //   const [open, setOpen] = useState(!!promotionId);

// //   // Dữ liệu mẫu (thay bằng API call trong thực tế)
// //   const [promotionData, setPromotionData] = useState<Promotion | null>(null);
// //   const form = useForm({
// //     defaultValues: {
// //       trainNumber: "",
// //       promotionName: "",
// //       discount: "",
// //     },
// //   });

// //   // Giả lập fetch dữ liệu promotion dựa trên id

// //   const onSubmit = (data: any) => {
// //     // Xử lý submit form (gọi API để cập nhật promotion)
// //     console.log("Updated promotion:", { id: promotionId, ...data });

// //     // Sau khi submit thành công
// //     setOpen(false);
// //     if (setId) setId(undefined); // Đóng dialog nếu dùng props
// //     if (onSubmitSuccess) onSubmitSuccess();
// //     router.push("/manage/promotions"); // Chuyển hướng về danh sách
// //   };

// //   return (
// //     <Dialog
// //       open={open}
// //       onOpenChange={(value) => {
// //         setOpen(value);
// //         if (!value && setId) setId(undefined);
// //         if (!value) router.push("/manage/promotions");
// //       }}
// //     >
// //       <DialogTrigger asChild>
// //         <Button size="sm" className="h-7 gap-1">
// //           Edit Promotion
// //         </Button>
// //       </DialogTrigger>
// //       <DialogContent className="sm:max-w-[600px]">
// //         <Form {...form}>
// //           <form
// //             onSubmit={form.handleSubmit(onSubmit)}
// //             id="edit-promotion-form"
// //             className="grid gap-4 py-4"
// //           >
// //             <FormField
// //               control={form.control}
// //               name="promotionName"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel>Promotion Name</FormLabel>
// //                   <Input id="promotionName" {...field} />
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //             <FormField
// //               control={form.control}
// //               name="discount"
// //               render={({ field }) => (
// //                 <FormItem>
// //                   <FormLabel>Discount</FormLabel>
// //                   <Input id="discount" {...field} />
// //                   <FormMessage />
// //                 </FormItem>
// //               )}
// //             />
// //           </form>
// //         </Form>
// //         <DialogFooter>
// //           <Button type="submit" form="edit-promotion-form">
// //             {manageCarriageT("UpdateCarriage")}
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useTranslations } from "next-intl";
// import { useEffect } from "react";
// import { toast } from "@/components/ui/use-toast";
// import { handleErrorApi } from "@/lib/utils";
// import {
//   useGetPromotion,
//   useUpdatePromotionMutation,
// } from "@/queries/usePromotion";
// import {
//   UpdatePromotionBody,
//   UpdatePromotionBodyType,
// } from "@/schemaValidations/promotion.schema";
// import { PROMOTION_STATUSES } from "@/schemaValidations/promotion.schema";

// type EditPromotionProps = {
//   id: number;
//   setId: (value: number | undefined) => void;
//   onSubmitSuccess?: () => void;
// };

// export default function EditPromotion({
//   id,
//   setId,
//   onSubmitSuccess,
// }: EditPromotionProps) {
//   const t = useTranslations("ManagePromotion");
//   const { data } = useGetPromotion({
//     id,
//     enabled: Boolean(id),
//   });
//   const updatePromotionMutation = useUpdatePromotionMutation();

//   const form = useForm<UpdatePromotionBodyType>({
//     resolver: zodResolver(UpdatePromotionBody),
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

//   useEffect(() => {
//     if (data) {
//       const {
//         promotionCode,
//         promotionDescription,
//         promotionName,
//         discount,
//         startDate,
//         validity,
//         status,
//       } = data.payload.data;
//       form.reset({
//         promotionCode,
//         promotionDescription,
//         promotionName,
//         discount,
//         startDate: new Date(startDate).toISOString().slice(0, 16),
//         validity: new Date(validity).toISOString().slice(0, 16),
//         status,
//       });
//     }
//   }, [data, form]);

//   const reset = () => {
//     form.reset();
//     setId(undefined);
//   };

//   const onSubmit = async (values: UpdatePromotionBodyType) => {
//     if (updatePromotionMutation.isPending) return;
//     try {
//       const body: UpdatePromotionBodyType & { id: number } = {
//         id,
//         ...values,
//         discount: Number(values.discount),
//         startDate: new Date(values.startDate).toISOString(),
//         validity: new Date(values.validity).toISOString(),
//       };
//       const result = await updatePromotionMutation.mutateAsync(body);
//       toast({
//         description: result.payload.message,
//       });
//       reset();
//       if (onSubmitSuccess) onSubmitSuccess();
//     } catch (error) {
//       handleErrorApi({
//         error,
//         setError: form.setError,
//       });
//     }
//   };

//   return (
//     <Dialog
//       open={Boolean(id)}
//       onOpenChange={(value) => {
//         if (!value) {
//           reset();
//         }
//       }}
//     >
//       <DialogContent
//         className="sm:max-w-[600px] max-h-screen overflow-auto"
//         onCloseAutoFocus={() => {
//           form.reset();
//           setId(undefined);
//         }}
//       >
//         <DialogHeader>
//           <DialogTitle>{t("UpdatePromotion")}</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             className="grid auto-rows-max items-start gap-4 md:gap-8"
//             id="edit-promotion-form"
//             onSubmit={form.handleSubmit(onSubmit, (e) => {
//               console.log("Form errors:", e);
//             })}
//           >
//             <div className="grid gap-4 py-4">
//               <FormField
//                 control={form.control}
//                 name="promotionCode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("PromotionCode")}</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder={t("PromotionCodePlaceholder")}
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="promotionDescription"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("PromotionDescription")}</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder={t("PromotionDescriptionPlaceholder")}
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="promotionName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("PromotionName")}</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder={t("PromotionNamePlaceholder")}
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="discount"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("Discount")}</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         step="0.01"
//                         placeholder={t("DiscountPlaceholder")}
//                         {...field}
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="startDate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("StartDate")}</FormLabel>
//                     <FormControl>
//                       <Input type="datetime-local" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="validity"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("Validity")}</FormLabel>
//                     <FormControl>
//                       <Input type="datetime-local" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("Status")}</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder={t("SelectStatus")} />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {PROMOTION_STATUSES.map((status) => (
//                           <SelectItem key={status} value={status}>
//                             {status}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button type="submit" form="edit-promotion-form">
//             {t("UpdatePromotion")}
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
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
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import {
  useGetPromotion,
  useUpdatePromotionMutation,
} from "@/queries/usePromotion";
import {
  UpdatePromotionBody,
  UpdatePromotionBodyType,
} from "@/schemaValidations/promotion.schema";
import { PROMOTION_STATUSES } from "@/schemaValidations/promotion.schema";

type EditPromotionProps = {
  id: number;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditPromotion({
  id,
  setId,
  onSubmitSuccess,
}: EditPromotionProps) {
  const t = useTranslations("ManagePromotion");
  const { data } = useGetPromotion({
    id,
    enabled: Boolean(id),
  });
  const updatePromotionMutation = useUpdatePromotionMutation();

  const form = useForm<UpdatePromotionBodyType>({
    resolver: zodResolver(UpdatePromotionBody),
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

  useEffect(() => {
    if (data) {
      const {
        promotionCode,
        promotionDescription,
        promotionName,
        discount,
        startDate,
        validity,
        status,
      } = data.payload.data;
      form.reset({
        promotionCode,
        promotionDescription,
        promotionName,
        discount,
        startDate: new Date(startDate).toISOString().slice(0, 16),
        validity: new Date(validity).toISOString().slice(0, 16),
        status,
      });
    }
  }, [data, form]);

  const reset = () => {
    form.reset();
    setId(undefined);
  };

  const onSubmit = async (values: UpdatePromotionBodyType) => {
    if (updatePromotionMutation.isPending) return;
    try {
      const body: UpdatePromotionBodyType & { id: number } = {
        id,
        ...values,
        discount: Number(values.discount),
      };
      const result = await updatePromotionMutation.mutateAsync(body);
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
          <DialogTitle>{t("UpdatePromotion")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-promotion-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("Form errors:", e);
            })}
          >
            <div className="grid gap-4 py-4">
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-promotion-form">
            {t("UpdatePromotion")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
