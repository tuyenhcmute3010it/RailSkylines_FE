import { Role } from "@/constants/type";
import {
  Home,
  LineChart,
  ShoppingCart,
  Users2,
  Salad,
  Table,
  Caravan,
  TrainFront,
  BellElectric,
  BadgeCent,
  Newspaper,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
    roles: [Role.Admin, Role.Staff],
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
    roles: [Role.Admin, Role.Staff],
  },
  {
    title: "Tàu Hỏa",
    Icon: TrainFront,
    href: "/manage/trains",
    // roles: [Role.Admin, Role.Staff],
  },
  {
    title: "Toa Tàu",
    Icon: Caravan,
    href: "/manage/carriages",
    // roles: [Role.Admin, Role.Staff],
  },
  {
    title: "Ga",
    Icon: BellElectric,
    href: "/manage/stations",
    // roles: [Role.Admin, Role.Staff],
  },
  {
    title: "Ưu Đãi",
    Icon: BadgeCent,
    href: "/manage/promotions",
    // roles: [Role.Admin, Role.Staff],
  },
  {
    title: "Bài Đăng",
    Icon: Newspaper,
    href: "/manage/articles",
    // roles: [Role.Admin, Role.Staff],
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
    // roles: [Role.Admin],
  },
];

export default menuItems;
