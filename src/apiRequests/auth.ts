// export default authApiRequest;
import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  RegisterBodyType,
  RegisterResType,
  VerifyCodeBodyType,
  VerifyEmailBodyType,
} from "@/schemaValidations/auth.schema";
const prefix = "/api/v1/auth";

const authApiRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/v1/auth/login", body, {
      baseUrl: "http://localhost:8080",
      credentials: "include", // Include cookies for refresh token
    }),
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/v1/auth/login", body, {
      baseUrl: "http://localhost:8080",
      credentials: "include",
    }), // Server-side login, same as login
  logout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post<void>("/api/v1/auth/logout", null, {
      baseUrl: "http://localhost:8080",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
      },
    }),
  sLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post<void>(
      "/api/v1/auth/logout",
      { refreshToken: body.refreshToken },
      {
        baseUrl: "http://localhost:8080",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ), // Server-side logout with refreshToken in body
  refreshToken: () =>
    http.post<RefreshTokenResType>("/api/v1/auth/refresh", null, {
      baseUrl: "http://localhost:8080",
      credentials: "include",
    }),
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/api/v1/auth/refresh", body, {
      baseUrl: "http://localhost:8080",
      credentials: "include",
    }), // Server-side refresh with explicit refreshToken
  setTokenToCookie: (body: { accessToken: string; refreshToken: string }) =>
    http.post("/api/v1/auth/token", body, {
      baseUrl: "http://localhost:8080",
      credentials: "include",
    }),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>(`${prefix}/register`, {
      email: body.email,
      password: body.password,
      fullName: body.fullName,
    }),
  verifyCode: (body: VerifyCodeBodyType) =>
    http.post<{ message: string }>(`${prefix}/verify-code`, body),
  resendCode: (body: VerifyEmailBodyType) =>
    http.post<{ message: string }>(`${prefix}/verify-email`, body),
};

export default authApiRequest;
