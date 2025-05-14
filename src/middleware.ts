// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { decodeToken } from "./lib/utils";
// import { Role } from "./constants/type";

// const guestPath = ["/guest"];
// const unAuthPaths = ["/login"];
// const managePaths = ["/manage"];
// // const onlyOwnerPaths = ["/manage/accounts"];
// const privatePaths = [...managePaths, ...guestPath];

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const accessToken = request.cookies.get("accessToken")?.value;
//   const refreshToken = request.cookies.get("refreshToken")?.value;
//   // 1.chua dang nhap thi khong cho vao private path
//   // if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
//   //   return NextResponse.redirect(new URL("/logout", request.url));
//   // }
//   // 2. Truong hop da dang nhap
//   if (refreshToken) {
//     //2.1 neu co tinh vao trang login se redirect ve trang chu
//     // dang nhap thi se khong cho vao login nua

//     if (unAuthPaths.some((path) => pathname.startsWith(path))) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     // Truong hop dang nhap roi nhung access token het han
//     if (
//       privatePaths.some((path) => pathname.startsWith(path)) &&
//       !accessToken
//     ) {
//       const url = new URL("/refresh-token", request.url);
//       url.searchParams.set("refreshToken", refreshToken);
//       url.searchParams.set("redirect", pathname);
//       return NextResponse.redirect(url);
//     }
//     // 2.3 vao khong dung role , redirect ve trang chu
//     const role = decodeToken(refreshToken).role;
//     // Guest nhung co vao router owner
//     const isGuestGoToManagePath =
//       role === Role.Guest &&
//       managePaths.some((path) => pathname.startsWith(path));
//     // khong phai guest Guest nhung co vao route guest
//     const isNotGuestGoToGuestPath =
//       role !== Role.Guest &&
//       guestPath.some((path) => pathname.startsWith(path));
//     // Khong phai Owner nhung co tinh truy cap vao route owner
//     // const isNotOwnerGoToOwnerPath =
//     //   role !== Role.Admin &&
//     //   onlyOwnerPaths.some((path) => pathname.startsWith(path));

//     if (
//       isGuestGoToManagePath ||
//       isNotGuestGoToGuestPath
//       // ||isNotOwnerGoToOwnerPath
//     ) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     return NextResponse.next();
//   }
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ["/manage/:path*", "/login", "/", "/guest/:paths"],
// };
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "@/lib/utils";
import { Role } from "@/constants/type";

const guestPath = ["/guest"];
const unAuthPaths = ["/login"];
const managePaths = ["/manage"];
const privatePaths = [...managePaths, ...guestPath];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Redirect authenticated users from login page
  if (refreshToken && unAuthPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle private paths
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (accessToken) {
    const decoded = decodeToken(accessToken);
    const role = decoded.role as RoleType;
    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestPath.some((path) => pathname.startsWith(path));

    if (isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login", "/", "/guest/:path*"],
};
