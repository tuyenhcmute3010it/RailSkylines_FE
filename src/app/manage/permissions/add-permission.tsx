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
  CreatePermissionBody,
  CreatePermissionBodyType,
} from "@/schemaValidations/permission.schema";
import { useAddPermissionMutation } from "@/queries/usePermission";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { HTTP_METHODS } from "@/schemaValidations/permission.schema";

export default function AddPermission() {
  const t = useTranslations("ManagePermission");
  const [open, setOpen] = useState(false);
  const form = useForm<CreatePermissionBodyType>({
    resolver: zodResolver(CreatePermissionBody),
    defaultValues: {
      name: "",
      apiPath: "",
      method: "GET",
      module: "",
    },
  });
  const addPermissionMutation = useAddPermissionMutation();

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (values: CreatePermissionBodyType) => {
    if (addPermissionMutation.isPending) return;
    try {
      const result = await addPermissionMutation.mutateAsync(values);
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
          <span>{t("AddPermission")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("AddPermission")}</DialogTitle>
          <DialogDescription>{t("AddPermissionDes")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-permission-form"
            className="grid gap-4 py-4"
            onReset={reset}
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("Form errors:", e);
            })}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("NamePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ApiPath")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ApiPathPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Method")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("SelectMethod")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {HTTP_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="module"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Module")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("ModulePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-permission-form">
            {t("AddPermission")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
