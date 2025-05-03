import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import PermissionTable from "./permissions-table";

export default async function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Manage Permission</CardTitle>
            <CardDescription>Manage Permission Of System</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <PermissionTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
