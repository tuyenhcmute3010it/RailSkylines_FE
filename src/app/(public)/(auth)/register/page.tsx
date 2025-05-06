import LoginForm from "@/app/(public)/(auth)/login/login-form";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import RegisterForm from "./register-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Login");
  return {
    title: t("header"),
  };
}
export default function Register() {
  return (
    <Suspense>
      <div className="min-h-screen flex items-center justify-center">
        <RegisterForm />
      </div>
    </Suspense>
  );
}
