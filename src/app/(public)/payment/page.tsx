"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useCreateBookingMutation } from "@/queries/useBooking";
import { CreateBookingBodyType } from "@/schemaValidations/booking.schema";
import { useQuery } from "@tanstack/react-query";
import promotionsApiRequest from "@/apiRequests/promotion";
import { PromotionSchemaType } from "@/schemaValidations/promotion.schema";
import { useAppContext } from "@/components/app-provider";
import { CustomerObjectEnum } from "@/schemaValidations/account.schema";

interface CartItem {
  trainId: string;
  trainName: string;
  trainTripId: number;
  coachName: string;
  seatNumber: number;
  departure: string;
  arrival: string;
  departureStation: string;
  departureStationId: number;
  arrivalStation: string;
  arrivalStationId: number;
  timestamp: number;
  price: number;
}

interface PassengerInfo {
  fullName: string;
  passengerType: "adult" | "child" | "student";
  idNumber: string;
}

export default function Payment() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuth } = useAppContext();
  const tickets = searchParams.get("tickets");
  const timerParam = searchParams.get("timer");

  const initialCartItems: CartItem[] = tickets ? JSON.parse(tickets) : [];
  const initialTimer = timerParam ? parseInt(timerParam, 10) : 0;
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [timer, setTimer] = useState(initialTimer);
  const [step, setStep] = useState(1);
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo[]>(
    initialCartItems.map(() => ({
      fullName: "",
      passengerType: "adult",
      idNumber: "",
    }))
  );
  const [promoCode, setPromoCode] = useState("");
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionSchemaType | null>(null);
  const [suggestedPromotion, setSuggestedPromotion] =
    useState<PromotionSchemaType | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const { mutate: createBooking, isPending: isLoading } =
    useCreateBookingMutation();

  // Fetch promotions
  const { data: promotionsData, isLoading: isPromotionsLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      if (!isAuth) return { payload: { data: { result: [] } } };
      const response = await promotionsApiRequest.listPromotions(1, 10);
      return response;
    },
    select: (response) =>
      (response?.payload?.data?.result || []).filter(
        (promo: PromotionSchemaType) => promo.status === "active"
      ),
    enabled: isAuth,
    staleTime: 5 * 60 * 1000,
  });

  // Handle promo code input and suggestion
  const handlePromoCodeChange = useCallback(
    (value: string) => {
      setPromoCode(value);
      setSelectedPromotion(null);

      if (value === "123123" && promotionsData) {
        const matchingPromo = promotionsData.find(
          (promo: PromotionSchemaType) => promo.promotionCode === "123123"
        );
        if (matchingPromo) {
          setSuggestedPromotion(matchingPromo);
        } else {
          setSuggestedPromotion(null);
        }
      } else {
        setSuggestedPromotion(null);
      }
    },
    [promotionsData]
  );

  // Apply promotion
  const applyPromotion = useCallback(() => {
    if (!promoCode || !promotionsData) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập mã khuyến mại hợp lệ.",
      });
      return;
    }

    const promotion = promotionsData.find(
      (promo: PromotionSchemaType) => promo.promotionCode === promoCode
    );

    if (!promotion) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mã khuyến mại không hợp lệ hoặc đã hết hạn.",
      });
      return;
    }

    const now = new Date();
    const validityDate = new Date(promotion.validity);
    if (validityDate < now) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mã khuyến mại đã hết hạn.",
      });
      return;
    }

    setSelectedPromotion(promotion);
    setSuggestedPromotion(null);
    toast({
      title: "Thành công",
      description: `Đã áp dụng khuyến mại: ${promotion.promotionName} (10% giảm).`,
    });
  }, [promoCode, promotionsData]);

  // Select suggested promotion
  const selectSuggestedPromotion = useCallback(() => {
    if (suggestedPromotion) {
      setPromoCode(suggestedPromotion.promotionCode);
      setSelectedPromotion(suggestedPromotion);
      setSuggestedPromotion(null);
      toast({
        title: "Thành công",
        description: `Đã chọn khuyến mại: ${suggestedPromotion.promotionName}.`,
      });
    }
  }, [suggestedPromotion]);

  // Timer countdown and expiration check
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/search");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Thời gian giữ vé đã hết. Vui lòng chọn lại vé.",
          });
          router.push("/search");
          return 0;
        }
        return prev - 1;
      });

      const allExpired = cartItems.every((item) => {
        const timeLeft = Math.floor(
          (item.timestamp + initialTimer * 1000 - Date.now()) / 1000
        );
        return timeLeft <= 0;
      });

      if (allExpired) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description:
            "Tất cả vé đã hết thời gian tạm giữ. Vui lòng chọn lại vé.",
        });
        router.push("/search");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cartItems, timer, router, initialTimer]);

  // Redirect to search if no tickets
  useEffect(() => {
    if (!tickets || cartItems.length === 0) {
      router.push("/search");
    }
  }, [tickets, cartItems, router]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "");
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate original total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  // Calculate display-only discount amount (10%)
  const calculateDiscountAmount = () => {
    if (!selectedPromotion) return 0;
    const subtotal = calculateTotal();
    return Math.round(subtotal * 0.1); // 10% discount for display
  };

  // Calculate display-only final total
  const calculateFinalTotal = () => {
    const subtotal = calculateTotal();
    if (!selectedPromotion) return subtotal;
    return Math.round(subtotal * 0.9); // 10% discount for display
  };

  // Handle passenger info input
  const handlePassengerInfoChange = (
    index: number,
    field: keyof PassengerInfo,
    value: string
  ) => {
    const updatedInfo = [...passengerInfo];
    updatedInfo[index] = { ...updatedInfo[index], [field]: value };
    setPassengerInfo(updatedInfo);
  };

  // Remove ticket
  const removeTicket = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    const updatedInfo = passengerInfo.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    setPassengerInfo(updatedInfo);
    router.replace(
      `/payment?tickets=${encodeURIComponent(
        JSON.stringify(updatedItems)
      )}&timer=${timer}`
    );
  };

  const mapPassengerTypeToCustomerObject = (
    type: string
  ): CustomerObjectEnum => {
    switch (type.toLowerCase()) {
      case "adult":
        return CustomerObjectEnum.adult;
      case "child":
        return CustomerObjectEnum.children;
      case "student":
        return CustomerObjectEnum.student;
      case "elderly":
        return CustomerObjectEnum.elderly;
      case "veteran":
        return CustomerObjectEnum.veteran;
      case "disabled":
        return CustomerObjectEnum.disabled;
      default:
        return CustomerObjectEnum.adult; // mặc định nếu không khớp
    }
  };

  const handlePayment = () => {
    if (step !== 3) return;

    if (!cartItems.length) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không có vé nào để thanh toán.",
      });
      return;
    }

    const trainTripId = cartItems[0].trainTripId;
    const ticketsParam = JSON.stringify(
      cartItems.map((item) => ({
        seatNumber: item.seatNumber,
        price: item.price,
        boardingStationId: item.departureStationId,
        alightingStationId: item.arrivalStationId,
      }))
    );

    const bookingBody: CreateBookingBodyType = {
      trainTripId,
      contactEmail,
      contactPhone: contactPhone || undefined,
      promotionId: selectedPromotion
        ? selectedPromotion.promotionId
        : undefined,
      seatIds: cartItems.map((item) => item.seatNumber),
      tickets: passengerInfo.map((info, index) => ({
        name: info.fullName,
        citizenId: info.idNumber,
        customerObject: mapPassengerTypeToCustomerObject(info.passengerType),
        boardingStationId: cartItems[index].departureStationId,
        alightingStationId: cartItems[index].arrivalStationId,
        price: cartItems[index].price, // Original price
      })),
      paymentType:
        selectedPaymentMethod === "vnpay_qr"
          ? "VNPAY"
          : selectedPaymentMethod === "international_card"
          ? "INTERNATIONAL_CARD"
          : "DOMESTIC_CARD",
    };

    // Validate bookingBody
    if (
      !bookingBody.contactEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingBody.contactEmail)
    ) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Email liên hệ không hợp lệ.",
      });
      return;
    }
    if (
      !bookingBody.tickets.every(
        (t) => t.name && t.citizenId.match(/^\d{9,12}$/) && t.price > 0
      )
    ) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          "Thông tin hành khách, số giấy tờ (9-12 chữ số), hoặc giá vé không hợp lệ.",
      });
      return;
    }
    if (
      !bookingBody.seatIds.length ||
      bookingBody.seatIds.some((id) => id <= 0)
    ) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Danh sách ghế không hợp lệ.",
      });
      return;
    }
    if (!bookingBody.trainTripId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "ID chuyến tàu không hợp lệ.",
      });
      return;
    }
    if (!ticketsParam) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Dữ liệu vé không hợp lệ.",
      });
      return;
    }

    console.log(">>>>>>> Sending createBooking request:", {
      bookingBody: JSON.stringify(bookingBody, null, 2),
      ticketsParam,
      trainTripId: bookingBody.trainTripId,
    });

    createBooking(
      {
        body: bookingBody,
        ticketsParam,
        trainTripId,
      },
      {
        onSuccess: (response) => {
          console.log(">>>>>>> createBooking onSuccess response:", response);
          if (response) {
            console.log(">>>>>>> Payment URL:", response.payload.data.data);
            window.location.href = response.payload.data.data;
          } else {
            console.log(">>>>>>> No payment URL in response:", response);
            toast({
              variant: "destructive",
              title: "Lỗi",
              description: response.message || "Không thể tạo đặt vé",
            });
          }
        },
        onError: (error: any) => {
          console.error(">>>>>>> createBooking onError:", {
            error,
            status: error.status,
            payload: error.payload,
            message: error.message,
          });
          let errorMessage =
            error.message || "Lỗi khi tạo đặt vé. Vui lòng thử lại.";
          if (error.status === 403) {
            errorMessage = "Bạn không có quyền truy cập endpoint này.";
          } else if (error.status === 401) {
            errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
            localStorage.removeItem("accessToken");
            router.push("/login");
          } else if (error.payload && typeof error.payload === "string") {
            const match = error.payload.match(/<p><b>Message<\/b> (.*?)<\/p>/);
            if (match && match[1]) {
              errorMessage = match[1];
            }
          } else if (!error.payload) {
            errorMessage = "Không nhận được phản hồi JSON từ server.";
          }
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: errorMessage,
          });
        },
      }
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      const isValid = passengerInfo.every(
        (info) => info.fullName && info.idNumber
      );
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin hành khách!",
        });
        return;
      }
      if (!contactEmail) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng nhập email liên hệ!",
        });
        return;
      }
      if (!selectedPaymentMethod) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng chọn phương thức thanh toán!",
        });
        return;
      }
      if (!termsAccepted) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng đồng ý với các điều khoản và quy định!",
        });
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Nhập thông tin hành khách và chọn phương thức thanh toán
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Thông tin giỏ vé</h2>
            <div className="space-y-4">
              <div>
                <label className="font-semibold">Email liên hệ</label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Nhập email liên hệ"
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="font-semibold">Số điện thoại liên hệ</label>
                <Input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Nhập số điện thoại (tùy chọn)"
                  className="w-full mt-1"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Họ tên</th>
                    <th className="p-2 border">Thông tin chỗ</th>
                    <th className="p-2 border">Giá vé</th>
                    <th className="p-2 border">Giảm đối tượng</th>
                    <th className="p-2 border">Khuyến mại</th>
                    <th className="p-2 border">Thành tiền (VNĐ)</th>
                    <th className="p-2 border"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => {
                    const timeLeft = Math.floor(
                      (item.timestamp + initialTimer * 1000 - Date.now()) / 1000
                    );
                    const isExpired = timeLeft <= 0;
                    return (
                      <tr key={index} className={isExpired ? "bg-red-100" : ""}>
                        <td className="p-2 border">
                          <div className="font-bold">Họ tên</div>
                          <Input
                            value={passengerInfo[index].fullName}
                            onChange={(e) =>
                              handlePassengerInfoChange(
                                index,
                                "fullName",
                                e.target.value
                              )
                            }
                            placeholder="Thông Tin Hành Khách"
                            className="w-full mt-1"
                            disabled={isExpired}
                          />
                          <div className="font-bold mt-1">Đối tượng</div>
                          <select
                            value={passengerInfo[index].passengerType}
                            onChange={(e) =>
                              handlePassengerInfoChange(
                                index,
                                "passengerType",
                                e.target.value as CustomerObjectEnum
                              )
                            }
                            className="w-full p-2 border rounded mt-1"
                            disabled={isExpired}
                          >
                            <option value="adult">Người lớn</option>
                            <option value="child">Trẻ em</option>
                            <option value="student">Sinh viên</option>
                            <option value="elderly">Người cao tuổi</option>
                            <option value="veteran">Cựu chiến binh</option>
                            <option value="disabled">Người khuyết tật</option>
                          </select>
                          <div className="font-bold mt-1">Số giấy tờ</div>
                          <div>
                            Số CMND/ Hộ chiếu/ Ngày tháng năm sinh trẻ em
                          </div>
                          <Input
                            value={passengerInfo[index].idNumber}
                            onChange={(e) =>
                              handlePassengerInfoChange(
                                index,
                                "idNumber",
                                e.target.value
                              )
                            }
                            placeholder="Số giấy tờ tùy thân"
                            className="w-full mt-1"
                            disabled={isExpired}
                          />
                        </td>
                        <td className="p-2 border">
                          {isExpired ? (
                            <div className="font-bold text-red-600">
                              Giữ trong: Hết hạn
                            </div>
                          ) : (
                            <div className="font-bold">
                              Giữ trong: {formatTime(timeLeft)} giây
                            </div>
                          )}
                          {item.trainName}
                          <br />
                          Ga đi: {item.departureStation}
                          <br />
                          Ga đến: {item.arrivalStation}
                          <br />
                          {item.departure}
                          <br />
                          {item.coachName} chỗ {item.seatNumber}
                          <br />
                          Ngồi mềm
                        </td>
                        <td className="p-2 border">
                          {formatPrice(item.price)}
                        </td>
                        <td className="p-2 border">0</td>
                        <td className="p-2 border">
                          {selectedPromotion
                            ? `${selectedPromotion.promotionName} (10%)`
                            : "Không có khuyến mại"}
                        </td>
                        <td className="p-2 border">
                          {formatPrice(item.price)}
                        </td>
                        <td className="p-2 border">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTicket(index)}
                            disabled={isExpired}
                          >
                            <Trash2 />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center bg-[#d9edf7] p-2">
              <div className="flex items-center space-x-2 relative">
                <div className="relative">
                  <Input
                    value={promoCode}
                    onChange={(e) => handlePromoCodeChange(e.target.value)}
                    placeholder="Nhập mã giảm giá tại đây"
                    className="w-64 border-2 border-blue-600 font-semibold focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm"
                    disabled={isPromotionsLoading}
                  />
                  {suggestedPromotion && (
                    <div className="absolute top-full mt-2 w-64 bg-white border rounded-lg shadow-lg p-2 z-10">
                      <p className="text-sm font-semibold">
                        {suggestedPromotion.promotionName}
                      </p>
                      <p className="text-xs text-gray-600">
                        Mã: {suggestedPromotion.promotionCode}
                      </p>
                      <p className="text-xs text-gray-600">Giảm: 10%</p>
                      <p className="text-xs text-gray-600">
                        Hạn sử dụng:{" "}
                        {new Date(
                          suggestedPromotion.validity
                        ).toLocaleDateString()}
                      </p>
                      <Button
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-700"
                        onClick={selectSuggestedPromotion}
                      >
                        Chọn khuyến mại này
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={applyPromotion}
                  disabled={isPromotionsLoading}
                >
                  Áp dụng
                </Button>
              </div>
              <div className="text-right mr-5">
                {selectedPromotion && (
                  <p className="text-sm">
                    Giảm giá (10%):{" "}
                    <span className="text-red-500">
                      -{formatPrice(calculateDiscountAmount())}
                    </span>
                  </p>
                )}
                <p className="text-lg font-semibold">
                  Tổng tiền: {formatPrice(calculateFinalTotal())}
                </p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Phương thức thanh toán</h2>
              <p className="text-sm text-gray-600">
                Vui lòng chọn phương thức thanh toán phù hợp:
              </p>
              <div className="space-y-4">
                <div className="border p-4 rounded-lg">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay_qr"
                      checked={selectedPaymentMethod === "vnpay_qr"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="form-radio"
                    />
                    <span className="font-semibold">
                      Thanh toán trực tuyến qua cổng thanh toán VNPAY - QR Pay
                    </span>
                  </label>
                  <p className="text-sm text-gray-600 mt-1 ml-6">
                    QR Pay trên ứng dụng Mobile Banking của các ngân hàng và Ví
                    VNPAY (quét mã VNPAY-QR để thanh toán)
                  </p>
                </div>
                <div className="border p-4 rounded-lg">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="international_card"
                      checked={selectedPaymentMethod === "international_card"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="form-radio"
                    />
                    <span className="font-semibold">Thẻ quốc tế</span>
                  </label>
                  <p className="text-sm text-gray-600 mt-1 ml-6">
                    Thẻ quốc tế phát hành trong nước và nước ngoài: Visa,
                    Master, JCB, UnionPay, Amex, Google Pay, Apple Pay, Samsung
                    Pay
                  </p>
                </div>
                <div className="border p-4 rounded-lg">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="domestic_card"
                      checked={selectedPaymentMethod === "domestic_card"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="form-radio"
                    />
                    <span className="font-semibold">
                      Thẻ ATM/Tài khoản nội địa
                    </span>
                  </label>
                  <p className="text-sm text-gray-600 mt-1 ml-6">
                    Thanh toán bằng thẻ ATM hoặc tài khoản ngân hàng nội địa
                  </p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center space-x-2 gap-10">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="form-checkbox h-7 w-7 border-2 border-blue-600 rounded focus:ring-blue-600"
                />
                <label
                  htmlFor="termsCheckbox"
                  className="text-sm text-gray-600"
                >
                  Tôi đã đọc kỹ và đồng ý tuân thủ tất cả các{" "}
                  <Link
                    href="/term-of-service"
                    className="text-md font-semibold text-blue-500 underline"
                    target="_blank"
                  >
                    quy định mua vé trực tuyến
                  </Link>
                  ,{" "}
                  <Link
                    href="/promotion"
                    className="text-md font-semibold text-blue-500 underline"
                    target="_blank"
                  >
                    chương trình khuyến mại
                  </Link>{" "}
                  của Tổng công ty đường sắt RailSkyLines và chịu trách nhiệm về
                  tính xác thực của các thông tin trên.
                </label>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          </div>
        );

      case 2: // Xác nhận thông tin
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Xác nhận thông tin</h2>
            <h3 className="text-lg font-semibold">Thông tin vé mua</h3>
            <div className="space-y-4">
              <p>
                <strong>Email liên hệ:</strong> {contactEmail}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {contactPhone || "Không có"}
              </p>
              {selectedPromotion && (
                <p>
                  <strong>Khuyến mại:</strong> {selectedPromotion.promotionName}{" "}
                  (10% giảm)
                </p>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">STT</th>
                    <th className="p-2 border">Thông tin vé mua</th>
                    <th className="p-2 border">TG giữ vé</th>
                    <th className="p-2 border">Giá (VNĐ)</th>
                    <th className="p-2 border">Thành tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => {
                    const timeLeft = Math.floor(
                      (item.timestamp + initialTimer * 1000 - Date.now()) / 1000
                    );
                    const isExpired = timeLeft <= 0;
                    return (
                      <tr key={index} className={isExpired ? "bg-red-100" : ""}>
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">
                          <div className="font-bold">
                            Họ tên: {passengerInfo[index].fullName}
                          </div>
                          <div>
                            Đối tượng:{" "}
                            {passengerInfo[index].passengerType === "adult"
                              ? "Người lớn"
                              : passengerInfo[index].passengerType === "child"
                              ? "Trẻ em"
                              : "Sinh viên"}
                          </div>
                          <div>Số giấy tờ: {passengerInfo[index].idNumber}</div>
                          <div>
                            Hành trình: {item.trainName} từ{" "}
                            {item.departureStation} đến {item.arrivalStation},{" "}
                            {item.departure}
                          </div>
                          <div>
                            Toa {item.coachName} chỗ {item.seatNumber}
                          </div>
                        </td>
                        <td className="p-2 border">
                          {isExpired ? (
                            <span className="text-red-500">Hết hạn</span>
                          ) : (
                            <>
                              Còn{" "}
                              <span className="text-red-500 font-bold">
                                {timeLeft}
                              </span>{" "}
                              giây
                            </>
                          )}
                        </td>
                        <td className="p-2 border">
                          {formatPrice(item.price)}₫
                        </td>
                        <td className="p-2 border">
                          {formatPrice(item.price)}₫
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="p-2 border-l border-t border-b"></td>
                    <td className="p-2 border-y border-gray-300"></td>
                    <td className="p-2 border-y border-gray-300"></td>
                    <td className="p-2 font-semibold text-md border-y border-gray-300">
                      Tổng Tiền
                    </td>
                    <td className="p-2 border text-lg font-semibold">
                      {formatPrice(calculateFinalTotal())}₫
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600">
              Quý khách vui lòng kiểm tra kỹ và xác nhận các thông tin đã nhập
              trước khi thực hiện giao dịch mua vé. Sau khi thực hiện giao dịch
              thanh toán ở trang tiếp theo quý khách sẽ không thể thay đổi được
              thông tin mua vé trên.
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                Nhập lại
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleNextStep}
                disabled={isLoading}
              >
                Đồng ý xác nhận
              </Button>
            </div>
          </div>
        );

      case 3: // Thanh toán
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Xác nhận thanh toán</h2>
            <p className="text-sm text-gray-600">
              Bạn đã chọn phương thức thanh toán:{" "}
              <strong>
                {selectedPaymentMethod === "vnpay_qr"
                  ? "VNPAY QR Pay"
                  : selectedPaymentMethod === "international_card"
                  ? "Thẻ quốc tế"
                  : "Thẻ ATM/Tài khoản nội địa"}
              </strong>
            </p>
            {selectedPromotion && (
              <p className="text-sm text-gray-600">
                Khuyến mại áp dụng:{" "}
                <strong>{selectedPromotion.promotionName}</strong> ( 10% giảm,
                tiết kiệm {formatPrice(calculateDiscountAmount())})
              </p>
            )}
            <p className="text-lg font-semibold">
              Tổng tiền: {formatPrice(calculateFinalTotal())}
            </p>
            <p className="text-sm text-gray-600">
              Nhấn "Xác nhận thanh toán" để hoàn tất giao dịch.
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                Quay lại
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Thanh Toán Vé Tàu - Đường Sắt RailSkyLine
      </h1>

      {/* Step Navigation */}
      <div className="flex justify-between mb-6">
        {["Xác nhận thông tin", "Xác nhận thông tin", "Thanh toán"].map(
          (label, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-2 ${
                step === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}. {label}
            </div>
          )
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="grid gap-6">{renderStepContent()}</div>
      ) : (
        <p className="text-center text-gray-600">
          Không có vé nào để thanh toán. Vui lòng quay lại trang chọn vé.
        </p>
      )}
    </div>
  );
}
