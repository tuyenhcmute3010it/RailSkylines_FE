"use client";

import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = ["/login", "logout", "refresh-token"];

export default function RefreshToken() {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(pathName);
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    let interval: any = null;
    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
        force,
      });
    };
    onRefreshToken();
    return () => {
      clearInterval(interval);
    };
  }, [pathName, router]);

  return null;
}
