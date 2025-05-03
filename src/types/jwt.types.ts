import { Role, TokenType } from "@/constants/type";

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType];
export interface TokenPayload {
  userId: number;
  role: RoleType;
  tokenType: TokenTypeValue;
  exp: number;
  iat: number;
}

export interface TableTokenPayload {
  iat: number;
  number: number;
  tokenType: (typeof TokenType)["TableToken"];
}

export type RoleType = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "GUEST" | "CUSTOMER";

export type Permission = {
  id: number;
  name: string;
  apiPath: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  module:
    | "ARTICLES"
    | "BOOKINGS"
    | "CARRIAGES"
    | "CLOCK_TIMES"
    | "PERMISSIONS"
    | "PROMOTIONS"
    | "ROLES"
    | "ROUTES"
    | "SCHEDULES"
    | "SEATS"
    | "STATIONS"
    | "TICKETS"
    | "TRAINS"
    | "TRAIN_TRIPS"
    | "USERS";
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
};

export type DecodedToken = {
  sub: string;
  permission: string[];
  exp: number;
  iat: number;
  user: {
    id: number;
    email: string;
    name: string;
  };
  role: RoleType;
};
