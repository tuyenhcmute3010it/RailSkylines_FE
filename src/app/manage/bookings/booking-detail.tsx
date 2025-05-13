"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import TableSkeleton from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSearchBookingQuery } from "@/queries/useBooking";

export default function BookingDetailPage() {
  const t = useTranslations("Booking");
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingCode = searchParams.get("bookingCode") || "";
  const vnpTxnRef = searchParams.get("vnpTxnRef") || "";
  const {
    data: booking,
    isLoading,
    error,
  } = useSearchBookingQuery(bookingCode, vnpTxnRef);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error || !booking) {
    return (
      <div className="text-red-500">{error?.message || t("Error_Generic")}</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button
        variant="outline"
        onClick={() => router.push("/bookings")}
        className="mb-4"
      >
        {t("BackToBookings")}
      </Button>
      <h2 className="text-2xl font-bold mb-4">{t("BookingDetails")}</h2>
      <div className="border rounded-lg p-4 shadow-sm">
        <p>
          <strong>{t("BookingCode")}:</strong> {booking.bookingCode}
        </p>
        <p>
          <strong>{t("BookingDate")}:</strong>{" "}
          {format(new Date(booking.date), "dd/MM/yyyy HH:mm")}
        </p>
        <p>
          <strong>{t("TotalPrice")}:</strong>{" "}
          {booking.totalPrice.toLocaleString()} VND
        </p>
        <p>
          <strong>{t("PaymentStatus")}:</strong>{" "}
          <span
            className={`${
              booking.paymentStatus === "success"
                ? "text-green-600"
                : booking.paymentStatus === "failed"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {booking.paymentStatus.toUpperCase()}
          </span>
        </p>
        <p>
          <strong>{t("ContactEmail")}:</strong> {booking.contactEmail || "N/A"}
        </p>
        <p>
          <strong>{t("ContactPhone")}:</strong> {booking.contactPhone || "N/A"}
        </p>
        <p>
          <strong>{t("PaymentType")}:</strong> {booking.paymentType}
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">{t("Tickets")}</h3>
      <div className="space-y-4">
        {booking.tickets.length > 0 ? (
          booking.tickets.map((ticket) => (
            <div
              key={ticket.ticketCode}
              className="border rounded-lg p-4 shadow-sm"
            >
              <p>
                <strong>{t("TicketCode")}:</strong> {ticket.ticketCode}
              </p>
              <p>
                <strong>{t("PassengerName")}:</strong> {ticket.name}
              </p>
              <p>
                <strong>{t("CitizenId")}:</strong> {ticket.citizenId}
              </p>
              <p>
                <strong>{t("Seat")}:</strong> {ticket.seatId}
              </p>
              <p>
                <strong>{t("Carriage")}:</strong> {ticket.carriageName}
              </p>
              <p>
                <strong>{t("Train")}:</strong> {ticket.trainName}
              </p>
              <p>
                <strong>{t("BoardingStation")}:</strong>{" "}
                {ticket.boardingStationName}
              </p>
              <p>
                <strong>{t("AlightingStation")}:</strong>{" "}
                {ticket.alightingStationName}
              </p>
              <p>
                <strong>{t("StartDay")}:</strong>{" "}
                {format(new Date(ticket.startDay), "dd/MM/yyyy")}
              </p>
              <p>
                <strong>{t("Price")}:</strong> {ticket.price.toLocaleString()}{" "}
                VND BILLION
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">{t("NoTickets")}</p>
        )}
      </div>
    </div>
  );
}
