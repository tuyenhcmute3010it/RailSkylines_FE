// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useForm } from "react-hook-form";
// import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/components/ui/use-toast";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useTranslations } from "next-intl";
// import { LoaderCircle } from "lucide-react";
// import Link from "next/link";
// import {
//   VerifyCodeBody,
//   VerifyCodeBodyType,
//   VerifyEmailBodyType,
// } from "@/schemaValidations/auth.schema";
// import { useAuth } from "@/queries/useAuth";

// export default function VerifyEmailForm() {
//   const t = useTranslations("VerifyEmail");
//   const errorMessageT = useTranslations("ErrorMessage");
//   const { verifyCode, resendCode } = useAuth();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email") || "";

//   const form = useForm<VerifyCodeBodyType>({
//     resolver: zodResolver(VerifyCodeBody),
//     defaultValues: {
//       email,
//       code: "",
//     },
//   });

//   const onSubmit = async (data: VerifyCodeBodyType) => {
//     try {
//       await verifyCode(data);
//       toast({
//         description: t("VerifySuccess"),
//       });
//       router.push("/login");
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         description: error.message,
//       });
//     }
//   };

//   const handleResendCode = async () => {
//     try {
//       await resendCode({ email });
//       toast({
//         description: t("ResendSuccess"),
//       });
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         description: error.message,
//       });
//     }
//   };

//   return (
//     <Card className="mx-auto max-w-sm">
//       <CardHeader>
//         <CardTitle className="text-2xl">{t("title")}</CardTitle>
//         <CardDescription>{t("description")}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
//             noValidate
//             onSubmit={form.handleSubmit(onSubmit)}
//           >
//             <div className="grid gap-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field, formState: { errors } }) => (
//                   <FormItem>
//                     <div className="grid gap-2">
//                       <Label htmlFor="email">{t("email")}</Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="example@railskylines.com"
//                         required
//                         disabled
//                         {...field}
//                       />
//                       <FormMessage>
//                         {errors.email?.message &&
//                           errorMessageT(errors.email.message as any)}
//                       </FormMessage>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="code"
//                 render={({ field, formState: { errors } }) => (
//                   <FormItem>
//                     <div className="grid gap-2">
//                       <Label htmlFor="code">{t("code")}</Label>
//                       <Input
//                         id="code"
//                         type="text"
//                         placeholder="ABC123"
//                         required
//                         {...field}
//                       />
//                       <FormMessage>
//                         {errors.code?.message &&
//                           errorMessageT(errors.code.message as any)}
//                       </FormMessage>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={form.formState.isSubmitting}
//               >
//                 {form.formState.isSubmitting && (
//                   <LoaderCircle className="w-5 h-5 animate-spin" />
//                 )}
//                 {t("verify")}
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleResendCode}
//                 disabled={form.formState.isSubmitting}
//               >
//                 {t("resendCode")}
//               </Button>
//               <div className="text-center text-sm">
//                 {t("backTo")}{" "}
//                 <Link href="/login" className="underline">
//                   {t("login")}
//                 </Link>
//               </div>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import {
  VerifyCodeBody,
  VerifyCodeBodyType,
} from "@/schemaValidations/auth.schema";
import {
  useVerifyCodeMutation,
  useResendCodeMutation,
} from "@/queries/useAuth";

export default function VerifyEmailForm() {
  const t = useTranslations("VerifyEmail");
  const errorMessageT = useTranslations("ErrorMessage");
  const verifyCodeMutation = useVerifyCodeMutation();
  const resendCodeMutation = useResendCodeMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm<VerifyCodeBodyType>({
    resolver: zodResolver(VerifyCodeBody),
    defaultValues: {
      email,
      code: "",
    },
  });

  const onSubmit = async (data: VerifyCodeBodyType) => {
    try {
      await verifyCodeMutation.mutateAsync(data);
      toast({
        description: t("VerifySuccess"),
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || t("VerifyError"),
      });
    }
  };

  const handleResendCode = async () => {
    try {
      await resendCodeMutation.mutateAsync({ email });
      toast({
        description: t("ResendSuccess"),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || t("ResendError"),
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@railskylines.com"
                        required
                        disabled
                        {...field}
                      />
                      <FormMessage>
                        {errors.email?.message &&
                          errorMessageT(errors.email.message)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="code">{t("code")}</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="ABC123"
                        required
                        maxLength={6}
                        {...field}
                      />
                      <FormMessage>
                        {errors.code?.message &&
                          errorMessageT(errors.code.message)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={verifyCodeMutation.isPending}
              >
                {verifyCodeMutation.isPending && (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                )}
                {t("verify")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
                disabled={resendCodeMutation.isPending || !email}
              >
                {t("resendCode")}
              </Button>
              <div className="text-center text-sm">
                {t("backTo")}{" "}
                <Link href="/login" className="underline">
                  {t("login")}
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
