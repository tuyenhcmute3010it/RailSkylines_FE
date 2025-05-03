// "use client";
// import {
//   checkAndRefreshToken,
//   getRefreshTokenFromLocalStorage,
// } from "@/lib/utils";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useRef } from "react";

// export default function RefreshTokenPage() {
//   const route = useRouter();
//   const searchParams = useSearchParams();
//   const refreshTokenFromUrl = searchParams.get("refreshToken");
//   const redirectPathname = searchParams.get("redirect");
//   const ref = useRef<any>(null);

//   useEffect(() => {
//     if (
//       ref.current ||
//       (refreshTokenFromUrl &&
//         refreshTokenFromUrl === getRefreshTokenFromLocalStorage())
//     ) {
//       checkAndRefreshToken({
//         onSuccess: () => {
//           route.push(redirectPathname || "/");
//         },
//       });
//     }
//   }, [route, refreshTokenFromUrl, redirectPathname]);

//   return <div>Refresh token ..........</div>;
// }

"use client";
import { checkAndRefreshToken } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPathname = searchParams.get("redirect");
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;

    checkAndRefreshToken({
      onSuccess: () => {
        router.push(redirectPathname || "/");
      },
      onError: () => {
        router.push("/login");
      },
    });
  }, [router, redirectPathname]);

  return <div>Refreshing token...</div>;
}
