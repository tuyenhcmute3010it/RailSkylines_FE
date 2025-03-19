"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RefreshToken from "./refresh-token";
import { RoleType } from "@/types/jwt.types";
import { createContext, useContext, useEffect, useState } from "react";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { Socket } from "socket.io-client";
import ListenLogoutSocket from "./listen-logout-socket";

// gc : 0
// staleTime

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const accessToken = getAccessTokenFromLocalStorage();
const refreshToken = getRefreshTokenFromLocalStorage();
const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
});
export const useAppContext = () => {
  return useContext(AppContext);
};
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRoleState] = useState<RoleType | undefined>();

  useEffect(() => {
    if (accessToken) {
      const decoded = decodeToken(accessToken);
      setRoleState(decoded.role);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{ isAuth: !!role, role, setRole: setRoleState }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ListenLogoutSocket />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
