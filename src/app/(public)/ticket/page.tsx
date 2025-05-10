"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import ticketApiRequest from "@/apiRequests/ticket";

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

interface TicketResponse {
  status: number;
  payload: {
    statusCode: number;
    error: string | null;
    message: string;
    data: Ticket;
  };
}

export default function TicketDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketCode = searchParams.get("ticketCode");
  const [ticketDetails, setTicketDetails] = useState<Ticket | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["ticket", ticketCode],
    queryFn: () => ticketApiRequest.getTicketByCode(ticketCode!),
    enabled: !!ticketCode,
  });

  console.log(">>>>>>>>>>>>>> data", data);
  useEffect(() => {
    if (data) {
      const ticket: Ticket = data.payload.data.data;
      setTicketDetails(ticket);
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thông tin vé. Vui lòng thử lại.",
      });
      router.push("/search");
    }
  }, [data, error, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
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
        <p className="text-lg">Đang tải thông tin vé...</p>
      </div>
    );
  }

  if (!ticketDetails || !ticketCode) {
    return (
      <div className="container mx-auto p-4 max-w-5xl text-center">
        <p className="text-lg text-red-500">Không tìm thấy thông tin vé.</p>
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
        Thông Tin Vé - Đường Sắt RailSkyLine
      </h1>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Chi Tiết Vé</h2>
        <div className="space-y-4">
          <p>
            <strong>Mã vé:</strong> {ticketDetails.ticketCode}
          </p>
          <p>
            <strong>Họ tên:</strong> {ticketDetails.name}
          </p>
          <p>
            <strong>Số giấy tờ:</strong> {ticketDetails.citizenId}
          </p>
          <p>
            <strong>Đối tượng:</strong>{" "}
            {ticketDetails.customerObject === "adult"
              ? "Người lớn"
              : ticketDetails.customerObject === "children"
              ? "Trẻ em"
              : "Sinh viên"}
          </p>
          <p>
            <strong>Hành trình:</strong>{" "}
            {ticketDetails.trainTrip.train.trainName} từ{" "}
            {ticketDetails.trainTrip.departure || "N/A"} đến{" "}
            {ticketDetails.trainTrip.arrival || "N/A"}
          </p>
          <p>
            <strong>Toa:</strong> Coach A{" "}
            {/* Replace with actual coachName if available */}
          </p>
          <p>
            <strong>Ghế:</strong> {ticketDetails.seat.seatId}
          </p>
          <p>
            <strong>Ngày khởi hành:</strong>{" "}
            {formatDate(ticketDetails.startDay)}
          </p>
          <p>
            <strong>Giá vé:</strong> {formatPrice(ticketDetails.price)} VND
          </p>
          <p>
            <strong>Trạng thái:</strong> {ticketDetails.ticketStatus}
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push("/search")}
        >
          Tìm vé mới
        </Button>
      </div>
    </div>
  );
}
