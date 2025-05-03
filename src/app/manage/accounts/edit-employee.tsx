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
import { Label } from "@/components/ui/label";
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useGetAccount, useUpdateAccountMutation } from "@/queries/useAccount";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function EditEmployee({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const t = useTranslations("ManageAccount");
  const [file, setFile] = useState<File | undefined>(undefined);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const { data, error } = useGetAccount({
    id: id as number,
    enabled: Boolean(id),
  });
  console.log(">>>data ne ", data);
  const updateAccountMutation = useUpdateAccountMutation();

  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      fullName: "",
      email: "",
      avatar: undefined,
      phoneNumber: "",
      citizenId: "",
      // role: "",
      changePassword: false,
      password: undefined,
      confirmPassword: undefined,
    },
  });

  useEffect(() => {
    if (data?.payload?.data) {
      form.reset({
        fullName: data.payload.data.fullName,
        email: data.payload.data.email,
        avatar: data.payload.data.avatar ?? undefined,
        phoneNumber: data.payload.data.phoneNumber ?? "",
        citizenId: data.payload.data.citizenId ?? "",
        // role: data.payload.data.role ?? "",
        changePassword: false,
        password: undefined,
        confirmPassword: undefined,
      });
    }
  }, [data, form]);

  const avatar = form.watch("avatar");
  const fullName = form.watch("fullName");
  const changePassword = form.watch("changePassword");

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);

  const reset = () => {
    setId(undefined);
    setFile(undefined);
    form.reset();
  };

  const onSubmit = async (values: UpdateEmployeeAccountBodyType) => {
    if (updateAccountMutation.isPending || !id) return;
    try {
      const result = await updateAccountMutation.mutateAsync({
        id,
        body: values,
        avatarFile: file,
      });
      toast({
        description: t("AccountUpdated", { email: values.email }),
      });
      reset();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
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
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("UpdateAccount")}</DialogTitle>
          <DialogDescription>{t("UpdateAccountDes")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className="rounded-none">
                          {fullName || "Avatar"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="fullName">{t("Name")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="fullName" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">{t("Email")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="email" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="phoneNumber">{t("PhoneNumber")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="phoneNumber" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="citizenId"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="citizenId">{t("CitizenId")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="citizenId" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {/* <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="role">{t("Role")}</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="role" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                /> */}
              <FormField
                control={form.control}
                name="changePassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="changePassword">
                        {t("ChangePassword")}
                      </Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {changePassword && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="password">{t("Password")}</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="password"
                            className="w-full"
                            type="password"
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {changePassword && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="confirmPassword">
                          {t("ConfirmPassword")}
                        </Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="confirmPassword"
                            className="w-full"
                            type="password"
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              form="edit-employee-form"
              disabled={updateAccountMutation.isPending}
            >
              {updateAccountMutation.isPending ? t("Submitting") : t("Save")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
