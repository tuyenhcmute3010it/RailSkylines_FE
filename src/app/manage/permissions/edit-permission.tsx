// src/components/permission/edit-permission.tsx
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
  useGetPermission,
  useUpdatePermissionMutation,
} from "@/queries/usePermission";
import {
  UpdatePermissionBody,
  UpdatePermissionBodyType,
} from "@/schemaValidations/permission.schema";
import { HTTP_METHODS } from "@/schemaValidations/permission.schema";

type EditPermissionProps = {
  id: number;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditPermission({
  id,
  setId,
  onSubmitSuccess,
}: EditPermissionProps) {
  const t = useTranslations("ManagePermission");
  const { data } = useGetPermission({
    id,
    enabled: Boolean(id),
  });
  const updatePermissionMutation = useUpdatePermissionMutation();

  const form = useForm<UpdatePermissionBodyType>({
    resolver: zodResolver(UpdatePermissionBody),
    defaultValues: {
      name: "",
      apiPath: "",
      method: "GET",
      module: "",
    },
  });

  useEffect(() => {
    if (data) {
      const { name, apiPath, method, module } = data.payload.data;
      form.reset({
        name,
        apiPath,
        method,
        module,
      });
    }
  }, [data, form]);

  const reset = () => {
    form.reset();
    setId(undefined);
  };

  const onSubmit = async (values: UpdatePermissionBodyType) => {
    if (updatePermissionMutation.isPending) return;
    try {
      const body: UpdatePermissionBodyType & { id: number } = {
        id,
        ...values,
      };
      const result = await updatePermissionMutation.mutateAsync(body);
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
          <DialogTitle>{t("UpdatePermission")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-permission-form"
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log("Form errors:", e);
            })}
          >
            <div className="grid gap-4 py-4">
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-permission-form">
            {t("UpdatePermission")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
