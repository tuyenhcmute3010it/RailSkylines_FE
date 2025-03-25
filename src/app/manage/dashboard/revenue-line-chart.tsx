"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueLineChart() {
  // fake 10 item
  const chartData = [
    {
      date: "01/01/2024",
      revenue: 1000,
    },
    {
      date: "02/01/2024",
      revenue: 2000,
    },
    {
      date: "03/01/2024",
      revenue: 1500,
    },
    {
      date: "04/01/2024",
      revenue: 3000,
    },
    {
      date: "05/01/2024",
      revenue: 2500,
    },
    {
      date: "06/01/2024",
      revenue: 4000,
    },
    {
      date: "07/01/2024",
      revenue: 3500,
    },
    {
      date: "08/01/2024",
      revenue: 5000,
    },
    {
      date: "09/01/2024",
      revenue: 4500,
    },
    {
      date: "10/01/2024",
      revenue: 6000,
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
                if (chartData.length < 8) {
                  return value;
                }
                if (chartData.length < 33) {
                  const date = parse(value, "dd/MM/yyyy", new Date());
                  return format(date, "dd");
                }
                return "";
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Line
              dataKey="revenue"
              type="linear"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
