import { getTranslations } from "next-intl/server";

export default async function TermsOfService() {
  const t = await getTranslations("TermsOfService");
  const introductionT = await getTranslations("TermsOfService.introduction");
  const usageT = await getTranslations("TermsOfService.usage");
  const intellectualPropertyT = await getTranslations(
    "TermsOfService.intellectualProperty"
  );
  const changesT = await getTranslations("TermsOfService.changes");
  const contactT = await getTranslations("TermsOfService.contact");

  return (
    <div className="flex flex-col">
      <section className="bg-secondary py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
        </div>
      </section>
      <section className="py-12 md:py-20 lg:py-24">
        <div className="max-w-4xl space-y-8">
          <div>
            <h2 className="text-3xl font-bold">{introductionT("title")}</h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {introductionT("content")}
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{usageT("title")}</h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {usageT("content")}
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              {intellectualPropertyT("title")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {intellectualPropertyT("content")}
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{changesT("title")}</h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {changesT("content")}
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{contactT("title")}</h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {contactT("content")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
