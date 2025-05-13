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
  ResetPasswordBody,
  ResetPasswordBodyType,
} from "@/schemaValidations/auth.schema";
import { useResetPasswordMutation } from "@/queries/useAuth";
import { useEffect } from "react";

export default function ResetPasswordForm() {
  const t = useTranslations("ResetPassword");
  const errorMessageT = useTranslations("ErrorMessage");
  const resetPasswordMutation = useResetPasswordMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBody),
    defaultValues: {
      email,
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    console.log("Email changed:", email);
    form.reset({
      email,
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [email, form]);

  useEffect(() => {
    console.log(
      "resetPasswordMutation state:",
      resetPasswordMutation.isPending
    );
  }, [resetPasswordMutation.isPending]);

  const onSubmit = async (data: ResetPasswordBodyType) => {
    console.log("Submitting reset password with data:", data);
    try {
      const result = await resetPasswordMutation.mutateAsync(data);
      console.log("Reset password successful:", result);
      toast({
        description: t("ResetSuccess"),
      });
      router.push("/login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      let errorMessage = t("ResetError");
      if (error.status === 400) {
        if (error.message.includes("Email chưa được đăng ký")) {
          errorMessage = t("EmailNotRegistered");
        } else if (error.message.includes("Mã xác minh không hợp lệ")) {
          errorMessage = t("InvalidCode");
        } else if (error.message.includes("Định dạng email không hợp lệ")) {
          errorMessage = t("InvalidEmailFormat");
        } else if (error.message.includes("Mã OTP chưa được xác minh")) {
          errorMessage = t("OTPNotVerified");
        }
      } else if (error.status === 401) {
        errorMessage = t("Unauthorized");
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = t("NetworkError");
      }
      toast({
        variant: "destructive",
        description: errorMessage,
      });
    }
  };

  const handleResendCode = () => {
    console.log("Navigating to resend code page");
    router.push("/resend-code");
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
                name="verificationCode"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="verificationCode">
                        {t("verificationCode")}
                      </Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="ABC123"
                        required
                        maxLength={6}
                        {...field}
                      />
                      <FormMessage>
                        {errors.verificationCode?.message &&
                          errorMessageT(errors.verificationCode.message)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">{t("newPassword")}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="********"
                        required
                        {...field}
                      />
                      <FormMessage>
                        {errors.newPassword?.message &&
                          errorMessageT(errors.newPassword.message)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">
                        {t("confirmPassword")}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="********"
                        required
                        {...field}
                      />
                      <FormMessage>
                        {errors.confirmPassword?.message &&
                          errorMessageT(errors.confirmPassword.message)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending && (
                  <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                )}
                {t("resetPassword")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
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
