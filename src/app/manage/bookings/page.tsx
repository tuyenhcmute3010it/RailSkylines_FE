"use client";

import { useTranslations } from "next-intl";
import BookingTable from "./booking-table";

export default function BookingsPage() {
  const t = useTranslations("Booking");

  return (
    <div className="container mx-auto py-6  max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">{t("Booking.BookingHistory")}</h1>
      <BookingTable />
    </div>
  );
}
