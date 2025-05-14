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
  VerifyEmailBodyType,
} from "@/schemaValidations/auth.schema";
import {
  useVerifyCodeMutation,
  useResendCodeMutation,
} from "@/queries/useAuth";
import { useEffect } from "react";

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

  useEffect(() => {
    console.log("Email changed:", email);
    form.reset({ email, code: "" });
  }, [email, form]);

  useEffect(() => {
    console.log("verifyCodeMutation state:", verifyCodeMutation.isPending);
    console.log("resendCodeMutation state:", resendCodeMutation.isPending);
  }, [verifyCodeMutation.isPending, resendCodeMutation.isPending]);

  // Log router navigation attempts
  useEffect(() => {
    console.log("Current route:", searchParams.toString());
  }, [router, searchParams]);

  const onSubmit = async (data: VerifyCodeBodyType) => {
    console.log("Submitting verification with data:", data);
    try {
      const result = await verifyCodeMutation.mutateAsync(data);
      console.log("Verification successful:", result);
      toast({
        description: t("VerifySuccess"),
      });
      router.push("/login");
    } catch (error: any) {
      console.error("Verification error:", error);
      let errorMessage = t("VerifyError");
      if (error.status === 400) {
        errorMessage =
          t("InvalidCode") || "Invalid or expired verification code.";
      } else if (error.status === 401) {
        errorMessage =
          t("Unauthorized") || "Unauthorized. Please log in again.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = t("NetworkError") || "Network error. Please try again.";
      }
      toast({
        variant: "destructive",
        description: errorMessage,
      });
    }
  };

  const handleResendCode = async () => {
    console.log("Resend code clicked, email:", email);
    if (!email || email.trim() === "") {
      console.warn("No email provided for resend");
      toast({
        variant: "destructive",
        description: t("NoEmailProvided"),
      });
      return;
    }
    // Additional validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn("Invalid email format:", email);
      toast({
        variant: "destructive",
        description: t("InvalidEmail"),
      });
      return;
    }

    const payload: VerifyEmailBodyType = { email };
    try {
      console.log("Sending resendCodeMutation with payload:", payload);
      const response = await resendCodeMutation.mutateAsync(payload);
      console.log("resendCodeMutation response:", response);
      toast({
        description: response.message || t("ResendSuccess"),
      });
    } catch (error: any) {
      console.error("resendCodeMutation error:", error);
      let errorMessage = t("ResendError");
      if (error.message.includes("HTTP 401")) {
        errorMessage =
          t("UnauthorizedError") ||
          "You are not authorized. Please log in or register first.";
      } else if (error.message === "Failed to fetch") {
        errorMessage =
          t("NetworkError") ||
          "Unable to connect to the server. Please check your network or try again later.";
      } else if (error.message.includes("Unexpected token")) {
        errorMessage =
          t("InvalidResponseError") ||
          "Invalid response from server. Please try again.";
      } else if (error.message.includes("getAuthToken is not defined")) {
        errorMessage =
          t("InternalError") ||
          "An internal error occurred. Please try again later.";
      }
      toast({
        variant: "destructive",
        description: errorMessage,
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
                  <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                )}
                {t("verify")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
                disabled={
                  resendCodeMutation.isPending || !email || email.trim() === ""
                }
              >
                {resendCodeMutation.isPending && (
                  <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                )}
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
