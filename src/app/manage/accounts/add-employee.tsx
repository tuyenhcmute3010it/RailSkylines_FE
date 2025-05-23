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
import { Label } from "@/components/ui/label";
import {
  CreateEmployeeAccountBody,
  CreateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAddAccountMutation } from "@/queries/useAccount";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { RoleDialog } from "./role-dialog";

export default function AddEmployee() {
  const t = useTranslations("ManageAccount");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const addAccountMutation = useAddAccountMutation();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const submissionRef = useRef<number>(0);
  const fileChangeRef = useRef<number>(0);

  const form = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: {
      fullName: "",
      email: "",
      avatar: undefined,
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      citizenId: "",
      role: {
        id: 0,
        name: "",
        description: null,
        active: false,
        permissions: [],
      },
    },
  });

  const avatar = form.watch("avatar");
  const fullName = form.watch("fullName");
  const role = form.watch("role");

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);

  const reset = () => {
    console.log("Resetting form and state");
    form.reset();
    setFile(undefined);
    submissionRef.current = 0;
    fileChangeRef.current = 0;
  };

  const onSubmit = async (values: CreateEmployeeAccountBodyType) => {
    submissionRef.current += 1;
    console.log(`Submission attempt #${submissionRef.current}:`, {
      values,
      avatarFile: file,
    });

    if (addAccountMutation.isPending) {
      console.warn("Mutation is pending, skipping submission");
      return;
    }

    try {
      // Validate role before submission
      if (!values.role || values.role.id === 0) {
        console.error("Invalid role selected:", values.role);
        form.setError("role", { message: t("RoleRequired") });
        throw new Error("Role is required");
      }

      const result = await addAccountMutation.mutateAsync({
        body: values,
        avatarFile: file,
      });
      console.log("Mutation successful:", result);
      toast({
        description: t("AccountAdded", { email: values.email }),
      });
      reset();
      setOpen(false);
    } catch (error: any) {
      console.error("Submission error:", {
        error,
        message: error.message,
        response: error.response?.data,
      });
      handleErrorApi({
        error,
        setError: form.setError,
      });
      toast({
        title: t("Error"),
        description:
          error.message ||
          error.response?.data?.message ||
          t("FailedToAddAccount"),
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fileChangeRef.current += 1;
    console.log(`File input change #${fileChangeRef.current}:`, e.target.files);

    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        console.warn("Invalid file type:", selectedFile.type);
        form.setError("avatar", { message: t("InvalidFileType") });
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        console.warn("File too large:", selectedFile.size);
        form.setError("avatar", { message: t("FileTooLarge") });
        return;
      }
      console.log("Valid file selected:", selectedFile.name);
      setFile(selectedFile);
      form.setValue("avatar", URL.createObjectURL(selectedFile));
    } else {
      console.log("No file selected");
    }
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        console.log("Dialog open change:", value);
        setOpen(value);
        if (!value) {
          reset();
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {t("CreateAccount")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{t("CreateAccount")}</DialogTitle>
          <DialogDescription>{t("AddDes")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-employee-form"
            onReset={() => {
              console.log("Form reset triggered");
              reset();
            }}
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.error("Form validation errors:", errors);
              toast({
                title: t("ValidationError"),
                description: t("PleaseFixFormErrors"),
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
                          {fullName || "Avatar"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => {
                          console.log("Avatar upload button clicked");
                          avatarInputRef.current?.click();
                        }}
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
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="role">{t("Role")}</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <RoleDialog
                          onChoose={(role) => {
                            console.log("Role selected:", role);
                            form.setValue("role", role);
                          }}
                        />
                        <Input
                          id="role"
                          className="w-full"
                          value={role.name || ""}
                          readOnly
                          placeholder={t("SelectRole")}
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
          <Button
            type="submit"
            form="add-employee-form"
            disabled={addAccountMutation.isPending}
          >
            {addAccountMutation.isPending ? t("Submitting") : t("Add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
