"use client";
import { useAppContext } from "@/components/app-provider";
import { toast } from "@/components/ui/use-toast";
import { decodeToken } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
export default function OauthPage() {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const { setRole } = useAppContext();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const router = useRouter();
  const message = searchParams.get("message");
  const count = useRef(0);
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        console.log(message);
        const { role } = decodeToken(accessToken);
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast({
              description: e.message || "Có lỗi xảy ra",
            });
          });
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast({
            description: message || "Có lỗi xảy ra",
          });
        });
        count.current++;
      }
    }
  }, [accessToken, refreshToken, setRole, message, mutateAsync]);

  return null;
}
