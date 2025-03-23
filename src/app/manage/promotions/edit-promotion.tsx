"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

// Định nghĩa type cho Promotion
type Promotion = {
  id: number;
  promotionName: string;
  discount: number;
};

type EditPromotionProps = {
  id?: number;
  setId?: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditPromotion({
  id,
  setId,
  onSubmitSuccess,
}: EditPromotionProps) {
  const manageCarriageT = useTranslations("ManageCarriage");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy promotionId từ props hoặc query params
  const promotionId = id || Number(searchParams.get("id"));
  const [open, setOpen] = useState(!!promotionId);

  // Dữ liệu mẫu (thay bằng API call trong thực tế)
  const [promotionData, setPromotionData] = useState<Promotion | null>(null);

  const form = useForm({
    defaultValues: {
      trainNumber: "",
      promotionName: "",
      discount: "",
    },
  });

  // Giả lập fetch dữ liệu promotion dựa trên id

  const onSubmit = (data: any) => {
    // Xử lý submit form (gọi API để cập nhật promotion)
    console.log("Updated promotion:", { id: promotionId, ...data });

    // Sau khi submit thành công
    setOpen(false);
    if (setId) setId(undefined); // Đóng dialog nếu dùng props
    if (onSubmitSuccess) onSubmitSuccess();
    router.push("/manage/promotions"); // Chuyển hướng về danh sách
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value && setId) setId(undefined);
        if (!value) router.push("/manage/promotions");
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          Edit Promotion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="edit-promotion-form"
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="promotionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotion Name</FormLabel>
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
                  <FormLabel>Discount</FormLabel>
                  <Input id="discount" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-promotion-form">
            {manageCarriageT("UpdateCarriage")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
