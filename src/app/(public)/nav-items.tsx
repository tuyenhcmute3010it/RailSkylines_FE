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
import { useEffect, useState } from "react";
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
import { useTranslations } from "next-intl";
import { SwitchLanguage } from "@/components/switch-language";
import DarkModeToggle from "@/components/dark-mode-toggle";
import DropdownAvatar from "../manage/dropdown-avatar";

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations("NavItem");
  const loginT = useTranslations("Login");
  const [isAuth, setIsAuth] = useState(false);
  const { role, setRole } = useAppContext();

  useEffect(() => {
    const token = getAccessTokenFromLocalStorage();
    setIsAuth(Boolean(token));
  }, []);

  const menuItems = [
    { title: t("FindTicket"), href: "/guest/menu" },
    { title: t("BookingInfo"), href: "/guest/orders" },
    { title: t("ReturnTicket"), href: "/guest/return" },
    { title: t("Promotion"), href: "/promotion" },
    { title: t("Term&Conditions"), href: "/term-of-service" },
    { title: t("Contact"), href: "/about" },
    { title: t("Blog"), href: "/blog" },
    {
      title: "Quản lý",
      href: "/manage/dashboard",
      role: [Role.Admin, Role.Staff],
    },
  ];

  return (
    <>
      {menuItems.map((item) => {
        // const canShow =
        //   (item.role === undefined && !item.hideWhenLogin) ||
        //   (!role && item.hideWhenLogin);
        // const isAuth = item.role && role && item.role.includes(role);
        const canShow = item.role === undefined;

        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
      {/* <SwitchLanguage />
      <DarkModeToggle /> */}
      {/* {isAuth ? (
        <DropdownAvatar />
      ) : (
        <Link href="/login" className={cn(className, "font-medium")}>
          {loginT("title")}
        </Link>
      )} */}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, "cursor-pointer")}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn đăng xuất?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Bạn sẽ mất phiên đăng nhập
                hiện tại.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction>Tiếp tục</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
