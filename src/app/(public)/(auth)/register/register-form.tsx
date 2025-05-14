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
  RegisterBody,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import { useRegisterMutation } from "@/queries/useAuth";

const getOauthGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI || "",
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export default function RegisterForm() {
  const t = useTranslations("Register");
  const errorMessageT = useTranslations("ErrorMessage");
  const registerMutation = useRegisterMutation();
  const router = useRouter();

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  const onSubmit = async (data: RegisterBodyType) => {
    try {
      await registerMutation.mutateAsync(data);
      toast({
        description:
          t("RegisterSuccess") +
          " Please check your email to verify your account.",
      });
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || t("RegisterError"),
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
              <FormField
                control={form.control}
                name="fullName"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">{t("fullName")}</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                        {...field}
                      />
                      <FormMessage>
                        {errors.fullName?.message &&
                          errorMessageT(errors.fullName.message)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="password">{t("password")}</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <FormMessage>
                        {errors.password?.message &&
                          errorMessageT(errors.password.message)}
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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending && (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                )}
                {t("title")}
              </Button>
              <Link href={getOauthGoogleUrl()}>
                <Button variant="outline" className="w-full" type="button">
                  {t("googleSignUp")}
                </Button>
              </Link>
              <div className="text-center text-sm">
                {t("alreadyHaveAccount")}{" "}
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
