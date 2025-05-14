import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { BadRequestError, EntityError, HttpError } from "./http";
import { toast } from "@/components/ui/use-toast";
import { OrderStatus, Role, TableStatus } from "@/constants/type";
import envConfig from "@/config";
import jwt from "jsonwebtoken";
import { format } from "date-fns";
import { TokenPayload } from "@/types/jwt.types";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import slugify from "slugify";
import { convert } from "html-to-text";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    // Handle 422 errors with field-specific messages
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else if (error instanceof BadRequestError) {
    // Handle 400 errors with custom error message
    toast({
      title: "Lỗi",
      description: error.payload.error || "Lỗi yêu cầu không hợp lệ",
      variant: "destructive",
      duration: duration ?? 5000,
    });
    if (setError) {
      // Optionally map to a specific field (e.g., trainName for uniqueness errors)
      setError("trainName", {
        type: "server",
        message: error.payload.error,
      });
    }
  } else if (error instanceof HttpError) {
    // Handle other HTTP errors
    toast({
      title: "Lỗi",
      description: error.payload.message || "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  } else {
    // Handle unexpected errors
    toast({
      title: "Lỗi",
      description: "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};
const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};
export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("accessToken", value);
};
export const setRefreshTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("refreshToken", value);
};
export const removeTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};
////
export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
  force?: boolean;
}) => {
  // Khong nen dua logic lay access vs refresh token ra khoi cai function 'checkAndRefreshToken'
  // Vi de moi lan ma checkAndRefreshToken() duoc goi thi chung ta se co mot access va refresh token moi
  // tranh hien tuong bug no lay access va refresh token cu o lan dau roi goi cho cac lan goi tiep theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  // Chua dang nhap thi cung khong cho chay
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);
  //Thoi diem het han cua token tinh theo epoch time(s)
  // Con khi cac ban dung cu phap new Date().getTime() thi no se tra ve epoch time (ms)
  const now = Math.round(new Date().getTime() / 1000);
  // Truong hop refresh token het han thi khong xu li nua

  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    return param?.onError && param.onError();
  }
  // Vi du access token cua chung ta co thoi gian het han la 10s
  // thi minh se kiem tra con 1/3 thoi gian (3s) thi minh se cho refresh token lai
  // thoi gian con lai se tinh dua tren cong thuc :decodedAccessToken.exp - now
  // thoi gian het han cua access token dua tren cong thuc : decodedAccessToken - decodeAccessToken.iat
  if (
    param?.force ||
    decodedAccessToken.exp - now <
      (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    // goi api refresh token
  }
};
///
export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

// export const getVietnameseDishStatus = (
//   status: (typeof DishStatus)[keyof typeof DishStatus]
// ) => {
//   switch (status) {
//     case DishStatus.Available:
//       return "Có sẵn";
//     case DishStatus.Unavailable:
//       return "Không có sẵn";
//     default:
//       return "Ẩn";
//   }
// };

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};
export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  );
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};
export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let result = null;
  try {
    result = await fn();
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }
  return result;
};

export const generateSlugUrl = ({ name, id }: { name: string; id: number }) => {
  return `${slugify(name)}-i.${id}`;
};
export const getIdFromSlugUrl = (slug: string) => {
  return Number(slug.split("-i.")[1]);
};

export const htmlToTextForDescription = (html: string) => {
  return convert(html, {
    limits: {
      maxInputLength: 140,
    },
  });
};
import { useAppContext } from "@/components/app-provider";
import { Permission } from "@/types/jwt.types";

export function usePermissions() {
  const { permissions } = useAppContext();

  const hasPermission = (permissionName: string): boolean => {
    if (!permissions) return false;
    return permissions.some((perm: Permission) => perm.name === permissionName);
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (!permissions) return false;
    return permissionNames.some((name) =>
      permissions.some((perm: Permission) => perm.name === name)
    );
  };

  const hasModulePermission = (module: Permission["module"]): boolean => {
    if (!permissions) return false;
    return permissions.some((perm: Permission) => perm.module === module);
  };

  return { hasPermission, hasAnyPermission, hasModulePermission };
}
