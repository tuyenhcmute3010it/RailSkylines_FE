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
const getAuthToken = (): string | null => {
  // Example: Retrieve token from cookies or local storage
  return localStorage.getItem("accessToken"); // Adjust based on your auth setup
};
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

  verifyCode: (body: VerifyCodeBodyType) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return http.post<VerifyCodeBodyType>(`${prefix}/verify-code`, body, {
      baseUrl: "http://localhost:8080",
      headers,
      credentials: "include",
    });
  },
  resendCode: async (body: VerifyEmailBodyType) => {
    console.log(
      "authApiRequest.resendCode: Sending request to:",
      `${prefix}/verify-email`,
      body
    );
    const response = await fetch(
      `http://localhost:8080${prefix}/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    console.log("authApiRequest.resendCode: Raw response:", {
      status: response.status,
      headers: response.headers
        ? Object.fromEntries(response.headers.entries())
        : "No headers",
    });
    return response;
  },
};

export default authApiRequest;
