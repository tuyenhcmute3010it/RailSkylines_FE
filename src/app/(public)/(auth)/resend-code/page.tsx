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
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import {
  VerifyEmailBody,
  VerifyEmailBodyType,
} from "@/schemaValidations/auth.schema";
import { useResendCodeMutation } from "@/queries/useAuth";
import { useEffect } from "react";

export default function ResendCodeForm() {
  const t = useTranslations("ResendCode");
  const errorMessageT = useTranslations("ErrorMessage");
  const resendCodeMutation = useResendCodeMutation();
  const router = useRouter();

  const form = useForm<VerifyEmailBodyType>({
    resolver: zodResolver(VerifyEmailBody),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    console.log("resendCodeMutation state:", resendCodeMutation.isPending);
  }, [resendCodeMutation.isPending]);

  const onSubmit = async (data: VerifyEmailBodyType) => {
    console.log("Submitting resend code with data:", data);
    try {
      const response = await resendCodeMutation.mutateAsync(data);
      console.log("Resend code successful:", response);
      toast({
        description: t("ResendSuccess"),
      });
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error("Resend code error:", error);
      let errorMessage = t("ResendError");
      if (error.status === 400) {
        if (error.message.includes("Email chưa được đăng ký")) {
          errorMessage = t("EmailNotRegistered");
        } else if (error.message.includes("Định dạng email không hợp lệ")) {
          errorMessage = t("InvalidEmailFormat");
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
              <Button
                type="submit"
                className="w-full"
                disabled={resendCodeMutation.isPending}
              >
                {resendCodeMutation.isPending && (
                  <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                )}
                {t("submit")}
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
