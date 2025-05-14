"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parse } from "date-fns";

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type RevenueByDate = {
  date: string;
  revenue: number;
};

export function RevenueLineChart({
  revenueByDate,
}: {
  revenueByDate: RevenueByDate[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
        <CardDescription>Theo ngày</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={revenueByDate}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (revenueByDate.length < 8) {
                  return value;
                }
                if (revenueByDate.length < 33) {
                  const date = parse(value, "dd/MM/yyyy", new Date());
                  return format(date, "dd");
                }
                return "";
              }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Line
              dataKey="revenue"
              type="linear"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
