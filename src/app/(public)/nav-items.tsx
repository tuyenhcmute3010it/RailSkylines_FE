"use client";
import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import {
  cn,
  getAccessTokenFromLocalStorage,
  handleErrorApi,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLogoutMutation } from "@/queries/useAuth";

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations("NavItem");
  const loginT = useTranslations("Login");
  const { isAuth, role, setIsAuth, setRole } = useAppContext();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const menuItems = [
    { title: t("FindTicket"), href: "/search" },
    { title: t("BookingInfo"), href: "/booking-info" },
    { title: t("ReturnTicket"), href: "/guest/return" },
    { title: t("Promotion"), href: "/promotion" },
    { title: t("Term&Conditions"), href: "/term-of-service" },
    { title: t("Contact"), href: "/about" },
    {
      title: "Quản lý",
      href: "/manage/dashboard",
      role: [Role.Admin, Role.Staff],
    },
    { title: t("Blog"), href: "/blog" },
  ];

  return (
    <>
      {menuItems.map((item) => {
        const canShow =
          item.role === undefined || (role && item.role.includes(role));
        if (canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
    </>
  );
}
