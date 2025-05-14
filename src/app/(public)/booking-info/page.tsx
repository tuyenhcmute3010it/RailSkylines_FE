"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import bookingApiRequest from "@/apiRequests/booking";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function BookingInfo() {
  const t = useTranslations("common");
  const [bookingId, setBookingId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingApiRequest.getBookingById(bookingId),
    enabled: !!bookingId && !!phone && !!email, // Only fetch if all fields are filled
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId || !phone || !email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t("BookingInfo.errorMessage.required"),
      });
      return;
    }

    try {
      const response = await bookingApiRequest.getBookingById(bookingId);
      if (
        response.payload.data.data.contactPhone === phone &&
        response.payload.data.data.contactEmail === email
      ) {
        router.push(`/booking-confirmation?bookingId=${bookingId}`);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: t("BookingInfo.errorMessage.mismatch"),
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: t("BookingInfo.errorMessage.notFound"),
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg bg-white border rounded shadow-lg">
      <h1 className="text-xl font-bold mb-4 text-blue-600 text-center">
        {t("BookingInfo.title")}
      </h1>
      <p className="text-sm mb-4 text-center text-gray-600">
        {t("BookingInfo.description")}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("BookingInfo.labels.bookingId")}
          </label>
          <Input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder={t("BookingInfo.placeholders.bookingId")}
            className="mt-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("BookingInfo.labels.phone")}
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("BookingInfo.placeholders.phone")}
            className="mt-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("BookingInfo.labels.email")}
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("BookingInfo.placeholders.email")}
            className="mt-1 w-full"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading
            ? t("BookingInfo.button.loading")
            : t("BookingInfo.button.submit")}
        </Button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {t("BookingInfo.error", {
            message: error.message || t("BookingInfo.errorMessage.notFound"),
          })}
        </p>
      )}
      <p className="mt-4 text-sm text-blue-600 text-center">
        <Link
          href="/term-of-service"
          className="flex items-center gap-3 text-lg font-semibold md:text-base"
        >
          {t("BookingInfo.footer")}
        </Link>
      </p>
    </div>
  );
}
