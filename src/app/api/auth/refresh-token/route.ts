import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";
export async function POST(request: Request) {
  console.log(request);
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json(
      {
        message: "Cant not find refreshToken",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken,
    });
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number;
    };

    (await cookieStore).set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    (await cookieStore).set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        { message: error.message ?? "Co Loi Xay Ra" },
        {
          status: 401,
        }
      );
    }
  }
}
