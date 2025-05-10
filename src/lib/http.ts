// // lib/http.ts
// import envConfig from "@/config";
// import { normalizePath } from "@/lib/utils";
// import { LoginResType } from "@/schemaValidations/auth.schema";
// import { redirect } from "next/navigation";

// type CustomOptions = Omit<RequestInit, "method"> & {
//   baseUrl?: string | undefined;
// };

// const ENTITY_ERROR_STATUS = 422;
// const AUTHENTICATION_ERROR_STATUS = 401;
// const BAD_REQUEST_STATUS = 400;

// type EntityErrorPayload = {
//   message: string;
//   errors: {
//     field: string;
//     message: string;
//   }[];
// };

// export class HttpError extends Error {
//   status: number;
//   payload: any;
//   constructor({
//     status,
//     payload,
//     message = "Lỗi HTTP",
//   }: {
//     status: number;
//     payload: any;
//     message?: string;
//   }) {
//     super(message);
//     this.status = status;
//     this.payload = payload;
//   }
// }
// export class EntityError extends HttpError {
//   status: typeof ENTITY_ERROR_STATUS;
//   payload: EntityErrorPayload;
//   constructor({
//     status,
//     payload,
//   }: {
//     status: typeof ENTITY_ERROR_STATUS;
//     payload: EntityErrorPayload;
//   }) {
//     super({ status, payload, message: "Lỗi thực thể" });
//     this.status = status;
//     this.payload = payload;
//   }
// }

// type BadRequestErrorPayload = {
//   statusCode: number;
//   error: string;
//   message: string;
//   data: any;
// };

// export class BadRequestError extends HttpError {
//   status: typeof BAD_REQUEST_STATUS;
//   payload: BadRequestErrorPayload;
//   constructor({
//     status,
//     payload,
//   }: {
//     status: typeof BAD_REQUEST_STATUS;
//     payload: BadRequestErrorPayload;
//   }) {
//     super({ status, payload, message: payload.error || "Lỗi yêu cầu" });
//     this.status = status;
//     this.payload = payload;
//   }
// }

// let clientLogoutRequest: null | Promise<any> = null;
// const isClient = typeof window !== "undefined";

// const request = async <Response>(
//   method: "GET" | "POST" | "PUT" | "DELETE",
//   url: string,
//   options?: CustomOptions | undefined
// ) => {
//   let body: FormData | string | undefined = undefined;
//   if (options?.body instanceof FormData) {
//     body = options.body;
//   } else if (options?.body) {
//     body = JSON.stringify(options.body);
//   }

//   const baseHeaders: {
//     [key: string]: string;
//   } =
//     body instanceof FormData
//       ? {}
//       : {
//           "Content-Type": "application/json",
//         };

//   if (isClient) {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       baseHeaders.Authorization = `Bearer ${accessToken}`;
//     }
//   }

//   const baseUrl =
//     options?.baseUrl === undefined
//       ? envConfig.NEXT_PUBLIC_API_ENDPOINT
//       : options.baseUrl;

//   const fullUrl = `${baseUrl}/${normalizePath(url)}`;

//   try {
//     const res = await fetch(fullUrl, {
//       ...options,
//       headers: {
//         ...baseHeaders,
//         ...options?.headers,
//       } as any,
//       body,
//       method,
//     });

//     const contentType = res.headers.get("content-type") || "";
//     let payload: any;

//     // Check if the response is JSON
//     if (contentType.includes("application/json")) {
//       payload = await res.json();
//     } else {
//       // For non-JSON responses, return the raw text
//       payload = await res.text();
//       if (!res.ok) {
//         // Throw an error with the text payload for non-OK responses
//         throw new HttpError({
//           status: res.status,
//           payload,
//           message: `Non-JSON response: ${payload.slice(0, 100)}...`,
//         });
//       }
//     }

//     const data = {
//       status: res.status,
//       payload,
//     };

//     if (!res.ok) {
//       if (
//         res.status === ENTITY_ERROR_STATUS &&
//         contentType.includes("application/json")
//       ) {
//         throw new EntityError(
//           data as {
//             status: 422;
//             payload: EntityErrorPayload;
//           }
//         );
//       } else if (
//         res.status === BAD_REQUEST_STATUS &&
//         contentType.includes("application/json")
//       ) {
//         throw new BadRequestError(
//           data as {
//             status: 400;
//             payload: BadRequestErrorPayload;
//           }
//         );
//       } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
//         if (isClient) {
//           if (!clientLogoutRequest) {
//             clientLogoutRequest = fetch("/api/auth/logout", {
//               method: "POST",
//               body: null,
//               headers: {
//                 ...baseHeaders,
//               } as any,
//             });
//             try {
//               await clientLogoutRequest;
//             } catch (error) {
//               console.error("Logout error:", error);
//             } finally {
//               localStorage.removeItem("accessToken");
//               clientLogoutRequest = null;
//               location.href = `/login`;
//             }
//           }
//         } else {
//           const accessToken = (options?.headers as any)?.Authorization?.split(
//             "Bearer "
//           )[1];
//           redirect(`/logout?accessToken=${accessToken}`);
//         }
//       } else {
//         throw new HttpError({
//           status: res.status,
//           payload,
//           message: contentType.includes("application/json")
//             ? payload.message || "Lỗi HTTP"
//             : `Non-JSON response: ${payload.slice(0, 100)}...`,
//         });
//       }
//     }

//     if (isClient) {
//       const normalizeUrl = normalizePath(url);
//       if (["api/v1/auth/login"].includes(normalizeUrl)) {
//         const { access_token } = (payload as LoginResType).data;
//         localStorage.setItem("accessToken", access_token);
//       } else if ("api/v1/auth/token" === normalizeUrl) {
//         const { accessToken, refreshToken } = payload as {
//           accessToken: string;
//           refreshToken: string;
//         };
//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("refreshToken", refreshToken);
//       } else if (["api/v1/auth/logout"].includes(normalizeUrl)) {
//         localStorage.removeItem("accessToken");
//       }
//     }

//     return data;
//   } catch (error: any) {
//     console.error(`HTTP ${method} error for ${fullUrl}:`, {
//       message: error.message,
//       status: error.status,
//       payload: error.payload,
//     });
//     throw error;
//   }
// };

// const http = {
//   get<Response>(
//     url: string,
//     options?: Omit<CustomOptions, "body"> | undefined
//   ) {
//     return request<Response>("GET", url, options);
//   },
//   post<Response>(
//     url: string,
//     body: any,
//     options?: Omit<CustomOptions, "body"> | undefined
//   ) {
//     return request<Response>("POST", url, { ...options, body });
//   },
//   put<Response>(
//     url: string,
//     body: any,
//     options?: Omit<CustomOptions, "body"> | undefined
//   ) {
//     return request<Response>("PUT", url, { ...options, body });
//   },
//   delete<Response>(
//     url: string,
//     options?: Omit<CustomOptions, "body"> | undefined
//   ) {
//     return request<Response>("DELETE", url, { ...options });
//   },
// };

// export default http;
import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
  params?: Record<string, string | number | boolean | undefined>;
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
  payload: any;
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

  let fullUrl = `${baseUrl}/${normalizePath(url)}`;
  if (options?.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += `?${queryString}`;
    }
  }

  console.log(`>>>>>>> HTTP ${method} request:`, {
    url: fullUrl,
    body: body instanceof FormData ? "FormData" : body,
    headers: { ...baseHeaders, ...options?.headers },
  });

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        ...baseHeaders,
        ...options?.headers,
      } as any,
      body,
      method,
    });

    const contentType = res.headers.get("content-type") || "";
    let payload: any;

    if (contentType.includes("application/json")) {
      payload = await res.json();
    } else {
      payload = await res.text();
      if (!res.ok) {
        throw new HttpError({
          status: res.status,
          payload,
          message: `Non-JSON response: ${payload.slice(0, 100)}...`,
        });
      }
    }

    const data = {
      status: res.status,
      payload,
    };

    if (!res.ok) {
      if (
        res.status === ENTITY_ERROR_STATUS &&
        contentType.includes("application/json")
      ) {
        throw new EntityError(
          data as {
            status: 422;
            payload: EntityErrorPayload;
          }
        );
      } else if (
        res.status === BAD_REQUEST_STATUS &&
        contentType.includes("application/json")
      ) {
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
              console.error("Logout error:", error);
            } finally {
              localStorage.removeItem("accessToken");
              clientLogoutRequest = null;
              location.href = `/login`;
            }
          }
        } else {
          const accessToken = (options?.headers as any)?.Authorization?.split(
            "Bearer "
          )[1];
          redirect(`/logout?accessToken=${accessToken}`);
        }
      } else {
        throw new HttpError({
          status: res.status,
          payload,
          message: contentType.includes("application/json")
            ? payload.message || "Lỗi HTTP"
            : `Non-JSON response: ${payload.slice(0, 100)}...`,
        });
      }
    }

    if (isClient) {
      const normalizeUrl = normalizePath(url);
      if (["api/v1/auth/login"].includes(normalizeUrl)) {
        const { access_token } = (payload as LoginResType).data;
        localStorage.setItem("accessToken", access_token);
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
  } catch (error: any) {
    console.error(`HTTP ${method} error for ${fullUrl}:`, {
      message: error.message,
      status: error.status,
      payload: error.payload,
    });
    throw error;
  }
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
