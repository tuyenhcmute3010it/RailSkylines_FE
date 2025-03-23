import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import ArticleTable from "./article-table";

export default async function Dashboard() {
  const manageAccountT = await getTranslations("ManageAccount");
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Article</CardTitle>
            <CardDescription>Manage Article</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <ArticleTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
