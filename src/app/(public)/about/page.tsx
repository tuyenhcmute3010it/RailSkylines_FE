import { getTranslations } from "next-intl/server";

export default async function About() {
  const t = await getTranslations("Footer");
  const ourStoryT = await getTranslations("About.ourStory");
  const ourValuesT = await getTranslations("About.ourValues");
  const ourCommitmentT = await getTranslations("About.ourCommitment");
  return (
    <div className="flex flex-col">
      <section className="bg-secondary  py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl"> {t("address")}</p>
        </div>
      </section>
      <section className="py-12 md:py-20 lg:py-24">
        <div className="max-w-4xl space-y-8">
          <div>
            <h2 className="text-3xl font-bold"> {ourStoryT("title")}</h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {ourStoryT("content")}
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{ourValuesT("title")}</h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {ourValuesT("content")}
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{ourCommitmentT("title")}</h2>
            <p className="mt-4 text-muted-foreground leading-8">
              {ourCommitmentT("content")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
