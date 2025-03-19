import LoginForm from "@/app/(public)/(auth)/login/login-form";

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Login");
  return {
    title: t("header"),
  };
}
export default function Login() {
  return (
    <Suspense>
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    </Suspense>
  );
}
