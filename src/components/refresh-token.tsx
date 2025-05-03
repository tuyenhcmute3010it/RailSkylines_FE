"use client";

// import authApiRequest from "@/apiRequests/auth";
// import socket from "@/lib/socket";
import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import jwt from "jsonwebtoken";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Nhung page sau se khong check refresh token
const UNAUTHENTICATED_PATH = ["/login", "logout", "refresh-token"];

export default function RefreshToken() {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(pathName);
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    let interval: any = null;
    //Phai goi lan dau tien vi interval se chay sau thoi gian time out
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
    // Time out interval phai be hon thoi gian het han cua access token
    // vi du thoi gian het han access token la 10s thi 1s minh se cho check 1 lan
    // const TIMEOUT = 1000;
    // interval = setInterval(onRefreshToken, TIMEOUT);

    // const onConnect = () => {
    //   console.log(socket.id);
    // };
    // if (socket.connected) {
    //   onConnect();
    // }
    // function onDisconnect() {
    //   console.log("disconnect");
    // }
    // function onRefreshTokenSocket() {
    //   onRefreshToken(true);
    // }
    // socket.on("connect", onConnect);
    // socket.on("disconnect", onDisconnect);
    // socket.on("refresh-token", onRefreshTokenSocket);
    // return () => {
    //   clearInterval(interval);
    //   socket.off("connect", onConnect);
    //   socket.off("disconnect", onDisconnect);
    //   socket.off("refresh-token", onRefreshTokenSocket);
    // };
  }, [pathName, router]);

  return null;
}
