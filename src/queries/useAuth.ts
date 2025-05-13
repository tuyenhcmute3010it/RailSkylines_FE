import authApiRequest from "@/apiRequests/auth";
import http from "@/lib/http";
import {
  RegisterBodyType,
  ResetPasswordBodyType,
  VerifyEmailBodyType,
} from "@/schemaValidations/auth.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.logout,
  });
};

export const useSetTokenToCookieMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.setTokenToCookie,
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApiRequest.register,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
  });
};

export const useVerifyCodeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApiRequest.verifyCode,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
  });
};

export const useResendCodeMutation = () => {
  return useMutation({
    mutationFn: async (body: VerifyEmailBodyType) => {
      console.log(
        "useResendCodeMutation: Starting mutation with payload:",
        body
      );

      // Introduce a 5-second delay to simulate pending state

      console.log("useResendCodeMutation: Delay completed, sending request...");
      try {
        const response = await authApiRequest.resendCode(body);
        console.log("useResendCodeMutation: Raw response:", {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        });

        // Check if response is JSON or plain text
        const contentType = response.headers.get("content-type") || "";
        let result: ResendCodeResponse;

        if (contentType.includes("application/json")) {
          result = await response.json();
          console.log("useResendCodeMutation: Parsed JSON response:", result);
        } else {
          // Handle plain text response
          const text = await response.text();
          result = { message: text || "new verify code sent" };
          console.log(
            "useResendCodeMutation: Parsed plain text response:",
            result
          );
        }

        console.log("useResendCodeMutation: Processed response:", result);
        return result;
      } catch (error: any) {
        console.error("useResendCodeMutation: Request failed:", {
          error: error.message,
          stack: error.stack,
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("useResendCodeMutation: Success:", data);
    },
    onError: (error: any) => {
      console.error("useResendCodeMutation: Error after mutation:", {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    },
  });
};
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (body: ResetPasswordBodyType) => {
      const response = await http.post("/api/v1/auth/change-password", body);
      return response.data;
    },
  });
};
