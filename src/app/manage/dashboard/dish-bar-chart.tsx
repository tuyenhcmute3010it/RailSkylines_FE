"use client";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
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

const colors = [
  "var(--color-chrome)",
  "var(--color-safari)",
  "var(--color-firefox)",
  "var(--color-edge)",
  "var(--color-other)",
];

const chartConfig = {
  successOrders: {
    label: "Đơn thanh toán",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type TrainRanking = {
  name: string;
  successOrders: number;
  fill: string;
};

export function DishBarChart({ chartData }: { chartData: TrainRanking[] }) {
  const chartDataColors = chartData.map((data, index) => ({
    ...data,
    fill: data.fill || colors[index % colors.length], // Use backend fill or fallback to colors array
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xếp hạng Tàu</CardTitle>
        <CardDescription>Được đi nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataColors}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <XAxis dataKey="successOrders" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="successOrders"
              name="Đơn thanh toán"
              layout="vertical"
              radius={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
