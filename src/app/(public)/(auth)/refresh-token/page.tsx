import { Suspense } from "react";
import RefreshToken from "@/components/refresh-token";

export default function LogoutPage() {
  return (
    <Suspense>
      <RefreshToken />
    </Suspense>
  );
}
