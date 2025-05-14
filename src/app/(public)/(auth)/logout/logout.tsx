"use client";
import { getAccessTokenFromLocalStorage, handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLogoutMutation } from "@/queries/useAuth";
import { useAppContext } from "@/components/app-provider";

export default function Logout() {
  const router = useRouter();
  const { setIsAuth, setRole } = useAppContext();
  const logoutMutation = useLogoutMutation();
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    const performLogout = async () => {
      try {
        await logoutMutation.mutateAsync({
          refreshToken: "", // Refresh token is handled by cookie
          accessToken: getAccessTokenFromLocalStorage() || "",
        });
        localStorage.removeItem("accessToken");
        setIsAuth(false);
        setRole(null);
        router.push("/login");
      } catch (error: any) {
        handleErrorApi({ error });
        router.push("/login");
      }
    };

    performLogout();
  }, [router, logoutMutation, setIsAuth, setRole]);

  return <div>Logging out...</div>;
}
export const runtime = "nodejs";
