"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, locales } from "@/config";
import { setUserLocale } from "@/services/locale";
import { SelectGroup } from "@radix-ui/react-select";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
export function SwitchLanguage() {
  const t = useTranslations("SwitchLanguage");
  const locale = useLocale();
  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        setUserLocale(value as Locale);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("title")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((locale) => (
            <SelectItem value={locale} key={locale}>
              <div className="flex items-center gap-2">
                {t(locale)}
                <Image
                  src={`/flags-${locale}.png`}
                  width={30}
                  height={20}
                  quality={100}
                  alt={`${locale} Flag`}
                  className="w-6 h-4 object-cover"
                />
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
