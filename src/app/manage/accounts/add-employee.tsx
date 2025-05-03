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
// import { Label } from "@/components/ui/label";
// import {
//   CreateEmployeeAccountBody,
//   CreateEmployeeAccountBodyType,
// } from "@/schemaValidations/account.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { PlusCircle, Upload } from "lucide-react";
// import { useMemo, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useAddAccountMutation } from "@/queries/useAccount";
// import { toast } from "@/components/ui/use-toast";
// import { handleErrorApi } from "@/lib/utils";
// import { useTranslations } from "next-intl";

// export default function AddEmployee() {
//   const t = useTranslations("ManageAccount");
//   const [file, setFile] = useState<File | undefined>(undefined);
//   const [open, setOpen] = useState(false);
//   const addAccountMutation = useAddAccountMutation();
//   const avatarInputRef = useRef<HTMLInputElement | null>(null);

//   const form = useForm<CreateEmployeeAccountBodyType>({
//     resolver: zodResolver(CreateEmployeeAccountBody),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       avatar: undefined,
//       password: "",
//       confirmPassword: "",
//       phoneNumber: "",
//       citizenId: "",
//     },
//   });

//   const avatar = form.watch("avatar");
//   const fullName = form.watch("fullName");

//   const previewAvatarFromFile = useMemo(() => {
//     if (file) {
//       return URL.createObjectURL(file);
//     }
//     return avatar;
//   }, [file, avatar]);

//   const reset = () => {
//     form.reset();
//     setFile(undefined);
//   };

//   const onSubmit = async (values: CreateEmployeeAccountBodyType) => {
//     if (addAccountMutation.isPending) return;
//     try {
//       const result = await addAccountMutation.mutateAsync({
//         body: values,
//         avatarFile: file,
//       });
//       toast({
//         description: t("AccountAdded", { email: values.email }),
//       });
//       reset();
//       setOpen(false);
//     } catch (error) {
//       handleErrorApi({
//         error,
//         setError: form.setError,
//       });
//       toast({
//         title: t("Error"),
//         description: t("FailedToAddAccount"),
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Dialog onOpenChange={setOpen} open={open}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="h-7 gap-1">
//           <PlusCircle className="h-3.5 w-3.5" />
//           <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//             {t("CreateAccount")}
//           </span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
//         <DialogHeader>
//           <DialogTitle>{t("CreateAccount")}</DialogTitle>
//           <DialogDescription>{t("AddDes")}</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             noValidate
//             className="grid auto-rows-max items-start gap-4 md:gap-8"
//             id="add-employee-form"
//             onReset={reset}
//             onSubmit={form.handleSubmit(onSubmit)}
//           >
//             <div className="grid gap-4 py-4">
//               <FormField
//                 control={form.control}
//                 name="avatar"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="flex gap-2 items-start justify-start">
//                       <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
//                         <AvatarImage src={previewAvatarFromFile} />
//                         <AvatarFallback className="rounded-none">
//                           {fullName || "Avatar"}
//                         </AvatarFallback>
//                       </Avatar>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         ref={avatarInputRef}
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) {
//                             if (!file.type.startsWith("image/")) {
//                               form.setError("avatar", {
//                                 message: t("InvalidFileType"),
//                               });
//                               return;
//                             }
//                             if (file.size > 5 * 1024 * 1024) {
//                               form.setError("avatar", {
//                                 message: t("FileTooLarge"),
//                               });
//                               return;
//                             }
//                             setFile(file);
//                             field.onChange(URL.createObjectURL(file));
//                           }
//                         }}
//                         className="hidden"
//                       />
//                       <button
//                         className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
//                         type="button"
//                         onClick={() => avatarInputRef.current?.click()}
//                       >
//                         <Upload className="h-4 w-4 text-muted-foreground" />
//                         <span className="sr-only">Upload</span>
//                       </button>
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="fullName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="grid grid-cols-4 items-center justify-items-start gap-4">
//                       <Label htmlFor="fullName">{t("Name")}</Label>
//                       <div className="col-span-3 w-full space-y-2">
//                         <Input id="fullName" className="w-full" {...field} />
//                         <FormMessage />
//                       </div>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="grid grid-cols-4 items-center justify-items-start gap-4">
//                       <Label htmlFor="email">{t("Email")}</Label>
//                       <div className="col-span-3 w-full space-y-2">
//                         <Input id="email" className="w-full" {...field} />
//                         <FormMessage />
//                       </div>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="grid grid-cols-4 items-center justify-items-start gap-4">
//                       <Label htmlFor="password">{t("Password")}</Label>
//                       <div className="col-span-3 w-full space-y-2">
//                         <Input
//                           id="password"
//                           className="w-full"
//                           type="password"
//                           {...field}
//                         />
//                         <FormMessage />
//                       </div>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="grid grid-cols-4 items-center justify-items-start gap-4">
//                       <Label htmlFor="confirmPassword">
//                         {t("ConfirmPassword")}
//                       </Label>
//                       <div className="col-span-3 w-full space-y-2">
//                         <Input
//                           id="confirmPassword"
//                           className="w-full"
//                           type="password"
//                           {...field}
//                         />
//                         <FormMessage />
//                       </div>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="phoneNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="grid grid-cols-4 items-center justify-items-start gap-4">
//                       <Label htmlFor="phoneNumber">{t("PhoneNumber")}</Label>
//                       <div className="col-span-3 w-full space-y-2">
//                         <Input id="phoneNumber" className="w-full" {...field} />
//                         <FormMessage />
//                       </div>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="citizenId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="grid grid-cols-4 items-center justify-items-start gap-4">
//                       <Label htmlFor="citizenId">{t("CitizenId")}</Label>
//                       <div className="col-span-3 w-full space-y-2">
//                         <Input id="citizenId" className="w-full" {...field} />
//                         <FormMessage />
//                       </div>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button
//             type="submit"
//             form="add-employee-form"
//             disabled={addAccountMutation.isPending}
//           >
//             {addAccountMutation.isPending ? t("Submitting") : t("Add")}
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

export default function AddEmployee() {
  const t = useTranslations("ManageAccount");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const addAccountMutation = useAddAccountMutation();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const submissionRef = useRef<number>(0); // Track submission attempts
  const fileChangeRef = useRef<number>(0); // Track file input changes

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
    },
  });

  const avatar = form.watch("avatar");
  const fullName = form.watch("fullName");

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);

  const reset = () => {
    form.reset();
    setFile(undefined);
    submissionRef.current = 0; // Reset submission counter
    fileChangeRef.current = 0; // Reset file change counter
  };

  const onSubmit = async (values: CreateEmployeeAccountBodyType) => {
    submissionRef.current += 1;
    console.log(`Submission attempt #${submissionRef.current}:`, values);

    if (addAccountMutation.isPending) {
      console.log("Mutation is pending, skipping submission");
      return;
    }

    try {
      const result = await addAccountMutation.mutateAsync({
        body: values,
        avatarFile: file,
      });
      console.log("Mutation result:", result);
      toast({
        description: t("AccountAdded", { email: values.email }),
      });
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Submission error:", error);
      handleErrorApi({
        error,
        setError: form.setError,
      });
      toast({
        title: t("Error"),
        description: t("FailedToAddAccount"),
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
        form.setError("avatar", { message: t("InvalidFileType") });
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        form.setError("avatar", { message: t("FileTooLarge") });
        return;
      }
      setFile(selectedFile);
      form.setValue("avatar", URL.createObjectURL(selectedFile));
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
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
            onReset={reset}
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
                        onChange={handleFileChange}
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
