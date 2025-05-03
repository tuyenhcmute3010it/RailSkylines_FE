////////////////// code for this///////////////////////////////////////////////////////////
import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;
const BAD_REQUEST_STATUS = 400;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "Lỗi HTTP",
  }: {
    status: number;
    payload: any;
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload, message: "Lỗi thực thể" });
    this.status = status;
    this.payload = payload;
  }
}

type BadRequestErrorPayload = {
  statusCode: number;
  error: string;
  message: string;
  data: any;
};

export class BadRequestError extends HttpError {
  status: typeof BAD_REQUEST_STATUS;
  payload: BadRequestErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: typeof BAD_REQUEST_STATUS;
    payload: BadRequestErrorPayload;
  }) {
    super({ status, payload, message: payload.error || "Lỗi yêu cầu" });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;
const isClient = typeof window !== "undefined";

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === BAD_REQUEST_STATUS) {
      throw new BadRequestError(
        data as {
          status: 400;
          payload: BadRequestErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: null,
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
            console.error("An error occurred:", error);
          } finally {
            localStorage.removeItem("accessToken");
            clientLogoutRequest = null;
            location.href = `/login`;
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }

  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (["api/v1/auth/login"].includes(normalizeUrl)) {
      const { access_token } = (payload as LoginResType).data;
      localStorage.setItem("accessToken", access_token);
      // Refresh token is handled as an HTTP-only cookie, not stored in localStorage
    } else if ("api/v1/auth/token" === normalizeUrl) {
      const { accessToken, refreshToken } = payload as {
        accessToken: string;
        refreshToken: string;
      };
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } else if (["api/v1/auth/logout"].includes(normalizeUrl)) {
      localStorage.removeItem("accessToken");
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
