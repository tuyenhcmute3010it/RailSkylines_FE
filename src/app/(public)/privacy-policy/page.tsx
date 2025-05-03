import { getTranslations } from "next-intl/server";

export default async function PrivacyPolicy() {
  const t = await getTranslations("PrivacyPolicy");

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="bg-secondary py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="max-w-4xl space-y-8">
          {/* Data Collection */}
          <div>
            <h2 className="text-3xl font-bold">{t("dataCollection.title")}</h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {t("dataCollection.content")}
            </p>
          </div>

          {/* Purpose of Use */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{t("usagePurpose.title")}</h2>
            <p className="text-muted-foreground leading-8">
              {t("usagePurpose.content")}
            </p>
            <ul className="space-y-4 text-muted-foreground leading-8">
              <li>{t("usageList.orderProcessing")}</li>
              <li>{t("usageList.customerService")}</li>
              <li>{t("usageList.marketing")}</li>
              <li>{t("usageList.serviceImprovement")}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
