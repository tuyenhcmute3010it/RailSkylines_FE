"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import bookingApiRequest from "@/apiRequests/booking";

interface Ticket {
  ticketId: number;
  customerObject: "adult" | "children" | "student";
  ticketCode: string;
  name: string;
  citizenId: string;
  price: number;
  startDay: string | null;
  ticketStatus: string;
  seat: {
    seatId: number;
    price: number;
    seatStatus: string;
  };
  trainTrip: {
    trainTripId: number;
    departure: string | null;
    arrival: string | null;
    train: {
      trainId: number;
      trainName: string;
    };
  };
}

interface Booking {
  bookingId: number;
  bookingCode: string;
  vnpTxnRef: string;
  transactionId: string;
  contactEmail: string;
  contactPhone?: string;
  totalPrice: number;
  paymentType: string;
  paymentStatus: string;
  date: string;
  payAt: string;
  tickets: Ticket[];
  promotions: { promotionId: number; discount: number }[];
}

interface BookingDetailType {
  bookingId: string;
  transactionId: string;
  contactEmail: string;
  contactPhone?: string;
  totalAmount: number;
  paymentType: string;
  paymentStatus: string;
  bookingDate: string;
  tickets: {
    ticketId: number;
    ticketCode: string; // Added
    name: string;
    citizenId: string;
    customerObject: "adult" | "children" | "student";
    trainId: string;
    trainName: string;
    coachName: string;
    seatNumber: number;
    departure: string | null;
    arrival: string | null;
    price: number;
  }[];
  promotionIds?: number[];
}

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [bookingDetails, setBookingDetails] =
    useState<BookingDetailType | null>(null);

  // Fetch booking details
  const { data, isLoading, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingApiRequest.getBookingById(bookingId!),
    enabled: !!bookingId,
  });

  useEffect(() => {
    if (data) {
      const booking: Booking = data.payload.data.data; // Access nested data.data
      const mappedDetails: BookingDetailType = {
        bookingId: booking.vnpTxnRef,
        transactionId: booking.transactionId,
        contactEmail: booking.contactEmail,
        contactPhone: booking.contactPhone?.trim() || undefined,
        totalAmount: booking.totalPrice,
        paymentType: booking.paymentType,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.date,
        tickets: booking.tickets.map((ticket) => ({
          ticketId: ticket.ticketId,
          ticketCode: ticket.ticketCode, // Added
          name: ticket.name,
          citizenId: ticket.citizenId,
          customerObject: ticket.customerObject,
          trainId: ticket.trainTrip.train.trainId?.toString() || "",
          trainName: ticket.trainTrip.train.trainName,
          coachName: "Coach A", // Replace with actual coachName if available
          seatNumber: ticket.seat.seatId,
          departure: ticket.trainTrip.departure,
          arrival: ticket.trainTrip.arrival,
          price: ticket.price,
        })),
        promotionIds: booking.promotions?.map((p) => p.promotionId),
      };
      setBookingDetails(mappedDetails);
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thông tin đặt vé. Vui lòng thử lại.",
      });
      router.push("/search");
    }
  }, [data, error, router]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "");
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-5xl text-center">
        <p className="text-lg">Đang tải thông tin đặt vé...</p>
      </div>
    );
  }

  if (!bookingDetails || !bookingId) {
    return (
      <div className="container mx-auto p-4 max-w-5xl text-center">
        <p className="text-lg text-red-500">Không tìm thấy thông tin đặt vé.</p>
        <Button
          className="mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push("/search")}
        >
          Quay lại tìm kiếm
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Xác Nhận Đặt Vé - Đường Sắt RailSkyLine
      </h1>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Đặt Vé Thành Công</h2>
        <p className="text-lg text-green-600">
          Cảm ơn bạn đã đặt vé! Thanh toán đã hoàn tất.
        </p>
        <div className="space-y-4">
          <p>
            <strong>Mã đặt vé:</strong> {bookingDetails.bookingId}
          </p>
          <p>
            <strong>Mã giao dịch:</strong> {bookingDetails.transactionId}
          </p>
          <p>
            <strong>Email liên hệ:</strong> {bookingDetails.contactEmail}
          </p>
          <p>
            <strong>Số điện thoại:</strong>{" "}
            {bookingDetails.contactPhone || "Không có"}
          </p>
          <p>
            <strong>Ngày đặt vé:</strong>{" "}
            {formatDate(bookingDetails.bookingDate)}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            {formatPrice(bookingDetails.totalAmount)} VND
          </p>
          <p>
            <strong>Phương thức thanh toán:</strong>{" "}
            {bookingDetails.paymentType}
          </p>
        </div>

        {bookingDetails.tickets && bookingDetails.tickets.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold">Thông tin vé đã đặt</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">STT</th>
                    <th className="p-2 border">Thông tin vé</th>
                    <th className="p-2 border">Giá (VND)</th>
                    <th className="p-2 border">Thành tiền (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingDetails.tickets.map((ticket, index) => (
                    <tr key={ticket.ticketId}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">
                        <div className="font-bold">Họ tên: {ticket.name}</div>
                        <div>Mã vé: {ticket.ticketCode}</div> {/* Added */}
                        <div>
                          Đối tượng:{" "}
                          {ticket.customerObject === "adult"
                            ? "Người lớn"
                            : ticket.customerObject === "children"
                            ? "Trẻ em"
                            : "Sinh viên"}
                        </div>
                        <div>Số giấy tờ: {ticket.citizenId}</div>
                        <div>
                          Hành trình: {ticket.trainName} từ{" "}
                          {ticket.departure || "N/A"} đến{" "}
                          {ticket.arrival || "N/A"}, Toa {ticket.coachName}, Ghế{" "}
                          {ticket.seatNumber}
                        </div>
                      </td>
                      <td className="p-2 border">
                        {formatPrice(ticket.price)}
                      </td>
                      <td className="p-2 border">
                        {formatPrice(ticket.price)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-2 border-l border-t border-b"></td>
                    <td className="p-2 border-y border-gray-300"></td>
                    <td className="p-2 font-semibold text-md border-y border-gray-300">
                      Tổng Tiền
                    </td>
                    <td className="p-2 border text-lg font-semibold">
                      {formatPrice(bookingDetails.totalAmount)} VND
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            Không có thông tin vé chi tiết. Vui lòng liên hệ hỗ trợ để biết thêm
            chi tiết.
          </p>
        )}

        <p className="text-sm text-gray-600">
          Vui lòng lưu lại mã đặt vé ({bookingDetails.bookingId}) để tra cứu
          hoặc liên hệ hỗ trợ. Vé đã được gửi qua email{" "}
          {bookingDetails.contactEmail}.
        </p>

        <div className="flex justify-between">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/search")}
          >
            Tìm vé mới
          </Button>
          <Link href="/booking-history">
            <Button className="bg-green-600 hover:bg-green-700">
              Xem lịch sử đặt vé
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
