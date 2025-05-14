import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";

const prefix = "/api/v1/users";
const filePrefix = "/api/v1/files";
export interface AccountProfileResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      name: string;
      role: Role;
    };
  };
}
export interface Role {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  permissions: Array<{
    id: number;
    name: string;
    apiPath: string;
    method: string;
    module: string;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string;
    updatedBy: string | null;
  }>;
}

// Define the account profile response type
export interface AccountProfileResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      name: string;
      role: Role;
    };
  };
}

// Define file upload response type
export interface FileUploadResponse {
  payload: {
    data: {
      fileName: string;
      uploadedAt: string;
    };
  };
}
const accountApiRequest = {
  list: (page: number = 1, size: number = 10) =>
    http.get<AccountListResType>(`${prefix}?page=${page - 1}&size=${size}`),
  addEmployee: async (
    body: CreateEmployeeAccountBodyType,
    avatarFile?: File
  ) => {
    let avatarUrl: string | undefined;
    if (avatarFile) {
      try {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("folder", "avatar");

        // Debug FormData contents
        for (let [key, value] of formData.entries()) {
          console.log(`FormData entry: ${key}=${value}`);
        }

        const uploadResult = await http.post<{
          data: any;
          fileName: string;
          uploadedAt: string;
        }>(`${filePrefix}`, formData);

        // Debug server response
        console.log("File upload response:", uploadResult);

        // Validate response
        if (!uploadResult?.payload?.data?.fileName) {
          throw new Error(
            "File upload failed: fileName is missing in response"
          );
        }

        avatarUrl = `/upload/avatar/${uploadResult.payload.data.fileName}`;
      } catch (error) {
        console.error("File upload error:", error);
        throw new Error("Failed to upload avatar file");
      }
    }

    const { confirmPassword, ...requestBody } = body;
    return http.post<AccountResType>(prefix, {
      ...requestBody,
      avatar: avatarUrl,
    });
  },
  updateEmployee: async (
    id: number,
    body: UpdateEmployeeAccountBodyType,
    avatarFile?: File
  ) => {
    let avatarUrl: string | undefined = body.avatar;
    if (avatarFile) {
      try {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("folder", "avatar");

        // Debug FormData contents
        for (let [key, value] of formData.entries()) {
          console.log(`FormData entry: ${key}=${value}`);
        }

        const uploadResult = await http.post<{
          fileName: string;
          uploadedAt: string;
        }>(`${filePrefix}`, formData);

        // Debug server response
        console.log("File upload response:", uploadResult);

        // Validate response
        if (!uploadResult?.payload?.fileName) {
          throw new Error(
            "File upload failed: fileName is missing in response"
          );
        }

        avatarUrl = `/upload/avatar/${uploadResult.payload.fileName}`;
      } catch (error) {
        console.error("File upload error:", error);
        throw new Error("Failed to upload avatar file");
      }
    }

    const { confirmPassword, changePassword, password, ...requestBody } = body;
    const payload =
      changePassword && password
        ? { ...requestBody, password, avatar: avatarUrl }
        : { ...requestBody, avatar: avatarUrl };
    return http.put<AccountResType>(`${prefix}/${id}`, payload);
  },
  getEmployee: (id: number) => http.get<AccountResType>(`${prefix}/${id}`),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`${prefix}/${id}`),
  me: async (): Promise<AccountProfileResponse> => {
    const response = await http.get<AccountProfileResponse>(
      "/api/v1/auth/account"
    );
    return response.payload;
  },
};

export default accountApiRequest;
