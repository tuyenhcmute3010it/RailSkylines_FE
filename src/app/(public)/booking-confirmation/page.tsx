"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import bookingApiRequest from "@/apiRequests/booking";
import QRCodeTicket from "@/components/QRCodeTicket";
import QRCodeTicketForPdf from "@/components/QRCodeForPdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
    ticketCode: string;
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
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfTemplateRef = useRef<HTMLDivElement | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<
    BookingDetailType["tickets"][0] | null
  >(null);

  // Pre-load logo

  // Fetch booking details
  const { data, isLoading, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingApiRequest.getBookingById(bookingId!),
    enabled: !!bookingId,
  });

  useEffect(() => {
    if (data) {
      const booking: Booking = data.payload.data.data;
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
          ticketCode: ticket.ticketCode,
          name: ticket.name,
          citizenId: ticket.citizenId,
          customerObject: ticket.customerObject,
          trainId: ticket.trainTrip.train.trainId?.toString() || "",
          trainName: ticket.trainTrip.train.trainName,
          coachName: "Coach A",
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
        title: "Error",
        description: "Unable to load booking information. Please try again.",
      });
      router.push("/search");
    }
  }, [data, error, router]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("VND", "");
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNullableDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return formatDate(dateStr);
  };

  // Download ticket as PDF
  const downloadTicketPDF = async (ticket: BookingDetailType["tickets"][0]) => {
    if (!pdfTemplateRef.current || !logoLoaded) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to generate PDF. Please ensure the logo is loaded.",
      });
      return;
    }

    setIsGeneratingPDF(true);
    setCurrentTicket(ticket); // Set the current ticket to render its template

    // Ensure QR code and content are rendered
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Temporarily make the template visible
    pdfTemplateRef.current.className =
      "p-6 bg-white border rounded shadow-lg w-[210mm] h-[400mm]";

    // Use html2canvas to capture the styled HTML
    const canvas = await html2canvas(pdfTemplateRef.current, {
      scale: 2,
      useCORS: true,
      logging: true,
    });
    const imgData = canvas.toDataURL("image/png");

    // Hide the template again
    pdfTemplateRef.current.className =
      "hidden p-6 bg-white border rounded shadow-lg w-[210mm] h-[400mm]";

    // Validate imgData
    if (!imgData.startsWith("data:image/png;base64,")) {
      console.error("Invalid image data:", imgData);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF due to invalid image data.",
      });
      setIsGeneratingPDF(false);
      setCurrentTicket(null);
      return;
    }

    // Create PDF with jsPDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [210, 400], // Custom height to match template (400mm)
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ticket_${ticket.ticketCode}.pdf`);

    setIsGeneratingPDF(false);
    setCurrentTicket(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-5xl text-center">
        <p className="text-lg">Loading booking information...</p>
      </div>
    );
  }

  if (!bookingDetails || !bookingId) {
    return (
      <div className="container mx-auto p-4 max-w-5xl text-center">
        <p className="text-lg text-red-500">Booking information not found.</p>
        <Button
          className="mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push("/search")}
        >
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* Hidden PDF Template for the current ticket */}
      <div
        ref={pdfTemplateRef}
        className="hidden p-6 bg-white border rounded shadow-lg w-[210mm] h-[400mm]"
      >
        {currentTicket && (
          <div className="text-center">
            {/* Header with Logo and Title */}
            <div className="flex items-center justify-between mb-4">
              <img src="/logo.png" alt="Logo" className="w-12 h-12" />
              <h1 className="text-2xl font-bold text-blue-600">THẺ LÊN TÀU</h1>
              <div className="w-12 h-12"></div>
            </div>

            {/* Boarding Pass Info */}
            <p className="text-sm mb-2">
              Khách hàng quý khách hàng, xin trình bày thẻ này khi lên tàu. Nếu
              quý khách không có thẻ này, vui lòng liên hệ nhân viên kiểm tra để
              được hỗ trợ.
            </p>

            {/* Journey Information Box */}
            <div className="border border-gray-300 p-4 mb-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">
                Thông tin hành trình
              </h2>
              <p>
                Ga đi - Ga đến:{" "}
                <span className="text-green-600">
                  {currentTicket.departure || "N/A"} -{" "}
                  {currentTicket.arrival || "N/A"}
                </span>
              </p>
              <p>
                Tàu/Trains:{" "}
                <span className="text-green-600">
                  {currentTicket.trainName || "N/A"}
                </span>
              </p>

              <p>
                Giờ/Thời/Time:{" "}
                <span className="text-green-600">
                  {currentTicket.departure
                    ? new Date(currentTicket.departure).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "N/A"}
                </span>
              </p>
              <p>
                Toa/Coach:{" "}
                <span className="text-green-600">
                  {currentTicket.coachName || "N/A"}
                </span>
              </p>
              <p>
                Chỗ/Seat:{" "}
                <span className="text-green-600">
                  {currentTicket.seatNumber
                    ? `${currentTicket.seatNumber}`
                    : "N/A"}
                </span>
              </p>
            </div>

            {/* Passenger Information Box */}
            <div className="border border-gray-300 p-4 mb-4 bg-gray-50">
              <h2 className="text-lg font-semibold text-blue-600 mb-2">
                Thông tin hành khách
              </h2>
              <p>
                Họ tên/Full Name:{" "}
                <span className="text-green-600">
                  {currentTicket.name || "N/A"}
                </span>
              </p>
              <p>
                CMND/Passport:{" "}
                <span className="text-green-600">
                  {currentTicket.citizenId || "N/A"}
                </span>
              </p>
              <p>
                Loại vé/Ticket:{" "}
                <span className="text-green-600">
                  {currentTicket.customerObject === "adult"
                    ? "Người lớn"
                    : currentTicket.customerObject === "children"
                    ? "Trẻ em"
                    : currentTicket.customerObject === "student"
                    ? "Học sinh"
                    : "N/A"}
                </span>
              </p>
              <p>
                Giá vé/Price:{" "}
                <span className="text-green-600">
                  {currentTicket.price
                    ? `${formatPrice(currentTicket.price)} VND`
                    : "N/A"}
                </span>
              </p>
            </div>

            {/* QR Code and Ticket Code */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <QRCodeTicketForPdf
                  ticketCode={currentTicket.ticketCode}
                  ref={qrCanvasRef}
                />
                <p className="text-sm text-red-500 mt-2">
                  Mã đặt chỗ: {currentTicket.ticketCode || "N/A"}
                </p>
                <p className="text-sm text-red-500">Đơn vị bán vé: WEB</p>
              </div>
            </div>

            {/* Notes */}
            <div className="text-xs text-red-500 mb-4">
              <p>
                - Chú ý: Quý khách vui lòng kiểm tra thông tin trên website:{" "}
                <a href="http://hoadon.vtdshn.vn" className="underline">
                  hoadon.vtdshn.vn
                </a>
                .
              </p>
              <p>
                - Để cập nhật lịch trình, vui lòng kiểm tra website{" "}
                <a href="http://railskylines.vn" className="underline">
                  dsvn.vn
                </a>{" "}
                mục "Tra cứu lịch trình tàu".
              </p>
              <p>
                - Để bảo vệ quyền lợi, vui lòng mang theo thẻ điện tử và CMND
                khi lên tàu.
              </p>
            </div>

            {/* Footer with Illustration */}
            <div className="text-sm">
              <p>
                Được đánh giá - Nằm trong danh sách Lonely Planet bình chọn là
                tuyến đường đẹp nhất, đáng trải nghiệm nhất{" "}
                <span className="text-blue-600">Tàu hỏa Việt Nam</span>.
              </p>
              <p>
                Ngày in/Printed date:{" "}
                <span className="text-green-600">
                  {new Date().toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Main UI */}
      <h1 className="text-2xl font-bold mb-6 text-center">
        Booking Confirmation - RailSkyLine
      </h1>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Booking Successful</h2>
        <p className="text-lg text-green-600">
          Thank you for booking! Payment has been completed.
        </p>
        <div className="space-y-4">
          <p>
            <strong>Booking Code:</strong> {bookingDetails.bookingId}
          </p>
          <p>
            <strong>Transaction Code:</strong> {bookingDetails.transactionId}
          </p>
          <p>
            <strong>Contact Email:</strong> {bookingDetails.contactEmail}
          </p>
          <p>
            <strong>Phone Number:</strong>{" "}
            {bookingDetails.contactPhone || "Not provided"}
          </p>
          <p>
            <strong>Booking Date:</strong>{" "}
            {formatDate(bookingDetails.bookingDate)}
          </p>
          <p>
            <strong>Total Amount:</strong>{" "}
            {formatPrice(bookingDetails.totalAmount)} VND
          </p>
          <p>
            <strong>Payment Method:</strong> {bookingDetails.paymentType}
          </p>
        </div>

        {bookingDetails.tickets && bookingDetails.tickets.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold">Booked Ticket Information</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">No.</th>
                    <th className="p-2 border">Ticket Information</th>
                    <th className="p-2 border">QR Code</th>
                    <th className="p-2 border">Price (VND)</th>
                    <th className="p-2 border">Total (VND)</th>
                    <th className="p-2 border">Download Ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingDetails.tickets.map((ticket, index) => (
                    <tr key={ticket.ticketId}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">
                        <div className="font-bold">
                          Full Name: {ticket.name}
                        </div>
                        <div>Ticket Code: {ticket.ticketCode}</div>
                        <div>
                          Passenger Type:{" "}
                          {ticket.customerObject === "adult"
                            ? "Adult"
                            : ticket.customerObject === "children"
                            ? "Child"
                            : "Student"}
                        </div>
                        <div>ID Number: {ticket.citizenId}</div>
                        <div>
                          Journey: {ticket.trainName} from{" "}
                          {ticket.departure || "N/A"} to{" "}
                          {ticket.arrival || "N/A"}, Coach {ticket.coachName},
                          Seat {ticket.seatNumber}
                        </div>
                      </td>
                      <td className="p-2 border text-center">
                        <QRCodeTicket
                          ticketCode={ticket.ticketCode}
                          ref={(el) => {
                            if (el) qrCanvasRef.current = el;
                          }}
                        />
                      </td>
                      <td className="p-2 border">
                        {formatPrice(ticket.price)}
                      </td>
                      <td className="p-2 border">
                        {formatPrice(ticket.price)}
                      </td>
                      <td className="p-2 border text-center">
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => downloadTicketPDF(ticket)}
                          disabled={isGeneratingPDF}
                        >
                          {isGeneratingPDF ? "Generating..." : "Download PDF"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-2 border-l border-t border-b"></td>
                    <td className="p-2 border-y border-gray-300"></td>
                    <td className="p-2 border-y border-gray-300"></td>
                    <td className="p-2 font-semibold text-md border-y border-gray-300">
                      Total Amount
                    </td>
                    <td className="p-2 border text-lg font-semibold">
                      {formatPrice(bookingDetails.totalAmount)} VND
                    </td>
                    <td className="p-2 border-y border-gray-300"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">
            No detailed ticket information available. Please contact support for
            more details.
          </p>
        )}

        <p className="text-sm text-gray-600">
          Please save your booking code ({bookingDetails.bookingId}) for
          reference or to contact support. The ticket has been sent to your
          email {bookingDetails.contactEmail}.
        </p>

        <div className="flex justify-between">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/search")}
          >
            Search for New Tickets
          </Button>
          <Link href="/booking-history">
            <Button className="bg-green-600 hover:bg-green-700">
              View Booking History
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
