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

export const TrainStatus = {
  Active: "active",
  InActive: "inactive",
} as const;

export const TrainStatusValues = [
  TrainStatus.Active,
  TrainStatus.InActive,
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
export const CarriageTypes = {
  SixBeds: "sixBeds",
  FourBed: "fourBeds",
  Seat: "seat",
} as const;

export const CarriageTypesValues = [
  CarriageTypes.SixBeds,
  CarriageTypes.FourBed,
  CarriageTypes.Seat,
] as const;
export const ManagerRoom = "manager" as const;

export const SeatStatus = {
  Available: "available",
  Unavailable: "unavailable",
  Pending: "pending",
  Booked: "booked",
} as const;

export const SeatStatusValues = [
  SeatStatus.Available,
  SeatStatus.Unavailable,
  SeatStatus.Pending,
  SeatStatus.Booked,
] as const;

export const SeatType = {
  LEVEL_1: "LEVEL_1",
  LEVEL_2: "LEVEL_2",
  LEVEL_3: "LEVEL_3",
} as const;

export const SeatTypeValues = [
  SeatType.LEVEL_1,
  SeatType.LEVEL_2,
  SeatType.LEVEL_3,
] as const;
