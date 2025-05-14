import { Button } from "@/components/ui/button";
import { Train, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface NoResultsProps {
  departureStation: string | null;
  arrivalStation: string | null;
  departureDate: string | null;
}

export default function NoResults({
  departureStation,
  arrivalStation,
  departureDate,
}: NoResultsProps) {
  const t = useTranslations("NoResults");

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md p-8 mx-auto max-w-2xl">
      {/* Icon */}
      <div className="mb-4">
        <Train className="w-16 h-16 text-gray-400" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        {t("title")}
      </h2>

      {/* Message */}
      <p className="text-gray-600 text-center mb-4">
        {t("message", {
          departureStation: departureStation || t("unknown"),
          arrivalStation: arrivalStation || t("unknown"),
          departureDate: departureDate || t("unknown"),
        })}
      </p>

      {/* Additional Info */}
      <div className="flex items-center text-yellow-600 bg-yellow-100 rounded-lg p-3 mb-6">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span className="text-sm">{t("suggestion")}</span>
      </div>

      {/* Call to Action */}
      <Link href="/">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          {t("tryAgain")}
        </Button>
      </Link>
    </div>
  );
}
