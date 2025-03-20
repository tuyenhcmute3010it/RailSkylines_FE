export const TokenType = {
  ForgotPasswordToken: "ForgotPasswordToken",
  AccessToken: "AccessToken",
  RefreshToken: "RefreshToken",
  TableToken: "TableToken",
} as const;

export const Role = {
  Admin: "Admin",
  Staff: "Staff",
  Guest: "Guest",
  Customer: "Customer",
} as const;

export const RoleValues = [
  Role.Admin,
  Role.Staff,
  Role.Guest,
  Role.Customer,
] as const;

export const DishStatus = {
  Available: "Available",
  Unavailable: "Unavailable",
  Hidden: "Hidden",
} as const;

export const DishStatusValues = [
  DishStatus.Available,
  DishStatus.Unavailable,
  DishStatus.Hidden,
] as const;

export const TableStatus = {
  Available: "Available",
  Hidden: "Hidden",
  Reserved: "Reserved",
} as const;

export const TableStatusValues = [
  TableStatus.Available,
  TableStatus.Hidden,
  TableStatus.Reserved,
] as const;

export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Rejected: "Rejected",
  Delivered: "Delivered",
  Paid: "Paid",
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Rejected,
  OrderStatus.Delivered,
  OrderStatus.Paid,
] as const;

export const ManagerRoom = "manager" as const;
