import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const TableSkeleton = () => {
  return (
    <div className="w-full">
      {/* Skeleton for Filters */}
      <div className="flex items-center py-4 gap-5">
        <div className="h-10 w-[150px] bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-[150px] bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-[150px] bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-[150px] bg-gray-200 animate-pulse rounded" />
        <div className="ml-auto h-10 w-[100px] bg-gray-200 animate-pulse rounded" />
      </div>
      {/* Skeleton for Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array(7)
                .fill(0)
                .map((_, index) => (
                  <TableHead key={index}>
                    <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(10)
              .fill(0)
              .map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array(7)
                    .fill(0)
                    .map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-6 w-full bg-gray-200 animate-pulse rounded" />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {/* Skeleton for Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-[100px] bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
};
export default TableSkeleton;
