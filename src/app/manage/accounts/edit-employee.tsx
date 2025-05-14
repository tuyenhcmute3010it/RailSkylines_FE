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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { useGetAccount, useUpdateAccountMutation } from "@/queries/useAccount";
import { RoleDialog } from "./role-dialog";

type EditEmployeeProps = {
  id: number; // Make id required
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export default function EditEmployee({
  id,
  setId,
  onSubmitSuccess,
}: EditEmployeeProps) {
  const t = useTranslations("ManageAccount");
  const [file, setFile] = useState<File | undefined>(undefined);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const { data, isLoading } = useGetAccount({
    id,
    enabled: Boolean(id),
  });
  const updateAccountMutation = useUpdateAccountMutation();

  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      fullName: "",
      email: "",
      avatar: undefined,
      phoneNumber: "",
      citizenId: "",
      changePassword: false,
      password: "",
      confirmPassword: "",
      role: {
        id: 0,
        name: "",
        description: null,
        active: false,
        permissions: [],
      },
    },
  });

  useEffect(() => {
    if (data?.payload?.data) {
      const { fullName, email, avatar, phoneNumber, citizenId, role } =
        data.payload.data;
      const validRole = role ?? {
        id: 0,
        name: "",
        description: null,
        active: false,
        permissions: [],
      };
      console.log("API role data:", role); // Debug API role
      form.reset({
        fullName: fullName || "",
        email: email || "",
        avatar: avatar ?? undefined,
        phoneNumber: phoneNumber ?? "",
        citizenId: citizenId ?? "",
        changePassword: false,
        password: "",
        confirmPassword: "",
        role: {
          id: validRole.id,
          name: validRole.name,
          description: validRole.description ?? null,
          active: validRole.active ?? false,
          permissions: validRole.permissions ?? [],
        },
      });
      setSelectedRoleName(validRole.name ?? "");
    }
  }, [data, form]);

  const avatar = form.watch("avatar");
  const fullName = form.watch("fullName");
  const changePassword = form.watch("changePassword");

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return url;
    }
    return avatar;
  }, [file, avatar]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const reset = () => {
    form.reset();
    setFile(undefined);
    setSelectedRoleName("");
    setId(undefined);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(undefined);
    }
  };

  const onSubmit = async (values: UpdateEmployeeAccountBodyType) => {
    console.log("Form submitted", values);
    if (updateAccountMutation.isPending) {
      console.log("Mutation skipped: isPending is true");
      return;
    }
    try {
      const body: UpdateEmployeeAccountBodyType & { id: number } = {
        id,
        ...values,
      };
      const result = await updateAccountMutation.mutateAsync({
        id,
        body,
        avatarFile: file,
      });
      toast({
        description: t("AccountUpdated", { email: values.email }),
        variant: "success",
      });
      reset();
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error("Update error:", error);
      handleErrorApi({
        error,
        setError: form.setError,
      });
      toast({
        description: t("UpdateFailed"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{t("Loading")}</span>
      </div>
    );
  }

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
        onCloseAutoFocus={reset}
      >
        <DialogHeader>
          <DialogTitle>{t("UpdateAccount")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Form validation errors:", errors);
              toast({
                description: t("ValidationFailed"),
                variant: "destructive",
              });
            })}
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
                          {fullName || t("AvatarFallback")}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              toast({
                                description: t("FileTooLarge"),
                                variant: "destructive",
                              });
                              return;
                            }
                            if (
                              !["image/png", "image/jpeg"].includes(file.type)
                            ) {
                              toast({
                                description: t("InvalidFileType"),
                                variant: "destructive",
                              });
                              return;
                            }
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
                        <span className="sr-only">{t("UploadAvatar")}</span>
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
                        <Input
                          id="fullName"
                          placeholder={t("NamePlaceholder")}
                          className="w-full"
                          {...field}
                          value={field.value ?? ""}
                        />
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
                        <Input
                          id="email"
                          placeholder={t("EmailPlaceholder")}
                          className="w-full opacity-50"
                          {...field}
                          readOnly
                          value={field.value ?? ""}
                        />
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
                        <Input
                          id="phoneNumber"
                          placeholder={t("PhoneNumberPlaceholder")}
                          className="w-full"
                          {...field}
                          value={field.value ?? ""}
                        />
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
                        <Input
                          id="citizenId"
                          placeholder={t("CitizenIdPlaceholder")}
                          className="w-full"
                          {...field}
                          value={field.value ?? ""}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="role">{t("Role")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <div>{selectedRoleName || t("NoRoleSelected")}</div>
                        <RoleDialog
                          onChoose={(role) => {
                            console.log("Selected role:", role); // Debug role
                            form.setValue("role", {
                              id: role.id,
                              name: role.name,
                              description: role.description ?? null,
                              active: role.active ?? true,
                              permissions: role.permissions ?? [],
                            });
                            setSelectedRoleName(role.name);
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
                            type="password"
                            placeholder={t("PasswordPlaceholder")}
                            className="w-full"
                            {...field}
                            value={field.value ?? ""}
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
                            type="password"
                            placeholder={t("ConfirmPasswordPlaceholder")}
                            className="w-full"
                            {...field}
                            value={field.value ?? ""}
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
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-employee-form"
            disabled={updateAccountMutation.isPending}
          >
            {updateAccountMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Submitting")}
              </>
            ) : (
              t("UpdateAccount")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
