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
// import { useTranslations } from "next-intl";

// export default function AddEmployee() {
//   const manageAccountT = useTranslations("ManageAccount");
//   const [file, setFile] = useState<File | null>(null);
//   const [open, setOpen] = useState(false);
//   const avatarInputRef = useRef<HTMLInputElement | null>(null);
//   const form = useForm<CreateEmployeeAccountBodyType>({
//     resolver: zodResolver(CreateEmployeeAccountBody),
//     defaultValues: {
//       name: "",
//       email: "",
//       avatar: undefined,
//       password: "",
//       confirmPassword: "",
//     },
//   });
//   const avatar = form.watch("avatar");
//   const name = form.watch("name");
//   const previewAvatarFromFile = useMemo(() => {
//     if (file) {
//       return URL.createObjectURL(file);
//     }
//     return avatar;
//   }, [file, avatar]);

//   return (
//     <Dialog onOpenChange={setOpen} open={open}>
//       <DialogTrigger asChild>
//         <Button size="sm" className="h-7 gap-1">
//           <PlusCircle className="h-3.5 w-3.5" />
//           <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//             {manageAccountT("CreateAccount")}
//           </span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
//         <DialogHeader>
//           <DialogTitle> {manageAccountT("CreateAccount")}</DialogTitle>
//           <DialogDescription>{manageAccountT("AddDes")}</DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             noValidate
//             className="grid auto-rows-max items-start gap-4 md:gap-8"
//             id="add-employee-form"
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
//                           {name || "Avatar"}
//                         </AvatarFallback>
//                       </Avatar>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         ref={avatarInputRef}
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) {
//                             setFile(file);
//                             field.onChange(
//                               "http://localhost:3000/" + file.name
//                             );
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
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <div className="grid grid-cols-4 items-center justify-items-start gap-4">
//                       <Label htmlFor="name"> {manageAccountT("Name")}</Label>
//                       <div className="col-span-3 w-full space-y-2">
//                         <Input id="name" className="w-full" {...field} />
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
//                       <Label htmlFor="email">Email</Label>
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
//                       <Label htmlFor="password">
//                         {manageAccountT("Password")}
//                       </Label>
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
//                         {manageAccountT("ConfirmPassword")}
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
//             </div>
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button type="submit" form="add-employee-form">
//             {manageAccountT("Add")}
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
      role: "",
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
  };

  const onSubmit = async (values: CreateEmployeeAccountBodyType) => {
    if (addAccountMutation.isPending) return;
    try {
      const result = await addAccountMutation.mutateAsync({
        body: values,
        avatarFile: file,
      });
      toast({
        description: t("AccountAdded", { email: values.email }),
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
