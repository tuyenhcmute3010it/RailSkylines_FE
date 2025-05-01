import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
export async function POST() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;
  const refreshToken = (await cookieStore).get("refreshToken")?.value;
  (await cookieStore).delete("refreshToken");
  (await cookieStore).delete("accessToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Khong nhan duoc access Token",
      },
      {
        status: 200,
      }
    );
  }
  try {
    const result = await authApiRequest.sLogout({
      accessToken,
      refreshToken,
    });
    return Response.json(result.payload);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Loi khi goi api den server backend" },
      {
        status: 200,
      }
    );
  }
}
