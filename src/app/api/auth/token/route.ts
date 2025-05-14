import { cookies } from "next/headers";
import { decodeJwt } from "jose"; // Sửa import
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    accessToken: string;
    refreshToken: string;
  };
  const { accessToken, refreshToken } = body;
  const cookieStore = cookies();
  try {
    const decodedAccessToken = decodeJwt(accessToken) as { exp: number };
    const decodedRefreshToken = decodeJwt(refreshToken) as { exp: number };
    (await cookieStore).set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    (await cookieStore).set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(body);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        { message: "Có Lỗi Xảy Ra" },
        {
          status: 500,
        }
      );
    }
  }
}
