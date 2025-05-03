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

  const handleLogout = async () => {
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
    }
  };

  const menuItems = [
    { title: t("FindTicket"), href: "/guest/menu" },
    { title: t("BookingInfo"), href: "/guest/orders" },
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
      {isAuth && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div
              className={cn(
                className,
                "cursor-pointer text-red-500 hover:text-red-600 transition duration-200 font-medium"
              )}
            >
              Đăng xuất
            </div>
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
              {/* <AlertDialogAction onClick={handleLogout}>
                Tiếp tục
              </AlertDialogAction> */}
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition"
                onClick={handleLogout}
              >
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
