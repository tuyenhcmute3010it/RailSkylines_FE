import authApiRequest from "@/apiRequests/auth";
import http from "@/lib/http";
import { RegisterBodyType } from "@/schemaValidations/auth.schema";
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
// export const useRegisterMutation = () => {
//   return useMutation({
//     mutationFn: async (body: RegisterBodyType) => {
//       const response = await http.post("/api/v1/auth/register", body);
//       return response;
//     },
//   });
// };

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApiRequest.resendCode,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
    },
  });
};
