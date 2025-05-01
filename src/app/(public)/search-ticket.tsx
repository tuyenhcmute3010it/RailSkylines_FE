// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function SearchTicket() {
//   return (
//     <div>
//       <div className="text-base font-semibold border-b pb-2 mb-2">
//         Thông tin hành trình
//       </div>
//       <div className="flex flex-col space-y-3">
//         <div>
//           <label className="block text-sm font-medium">Ga đi</label>
//           <Input
//             type="text"
//             placeholder="Ga đi"
//             className="w-full mt-1 text-sm"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Ga đến</label>
//           <Input
//             type="text"
//             placeholder="Ga đến"
//             className="w-full mt-1 text-sm"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Loại vé</label>
//           <div className="flex items-center space-x-3 mt-1">
//             <label className="flex items-center space-x-1">
//               <input type="radio" name="tripType" defaultChecked />
//               <span className="text-sm">Một chiều</span>
//             </label>
//             <label className="flex items-center space-x-1">
//               <input type="radio" name="tripType" />
//               <span className="text-sm">Khứ hồi</span>
//             </label>
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Ngày đi</label>
//           <Input
//             type="date"
//             className="w-full mt-1 text-sm"
//             placeholder="Đi ngày"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Ngày về</label>
//           <Input
//             placeholder="Đến ngày"
//             type="date"
//             className="w-full mt-1 text-sm"
//           />
//         </div>
//         <Button className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700">
//           Tìm kiếm
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchData {
  departureStation: string | null;
  arrivalStation: string | null;
  tripType: string | null;
  departureDate: string | null;
  returnDate: string | null;
}

interface SearchTicketProps {
  onSearch?: (searchData: SearchData) => void;
}

export default function SearchTicket({ onSearch }: SearchTicketProps) {
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchData: SearchData = {
      departureStation: formData.get("departureStation") as string | null,
      arrivalStation: formData.get("arrivalStation") as string | null,
      tripType: formData.get("tripType") as string | null,
      departureDate: formData.get("departureDate") as string | null,
      returnDate: formData.get("returnDate") as string | null,
    };

    // Gọi onSearch nếu được truyền
    if (onSearch) {
      onSearch(searchData);
    }

    // Tạo query string từ searchData
    const query = new URLSearchParams({
      ...(searchData.departureStation && {
        departureStation: searchData.departureStation,
      }),
      ...(searchData.arrivalStation && {
        arrivalStation: searchData.arrivalStation,
      }),
      ...(searchData.tripType && { tripType: searchData.tripType }),
      ...(searchData.departureDate && {
        departureDate: searchData.departureDate,
      }),
      ...(searchData.returnDate && { returnDate: searchData.returnDate }),
    }).toString();

    // Chuyển hướng sang trang /search với query string
    router.push(`/search?${query}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <div>
        <div className="text-base font-semibold border-b pb-2 mb-2">
          Thông tin hành trình
        </div>
        <div className="flex flex-col space-y-3">
          <div>
            <label className="block text-sm font-medium">Ga đi</label>
            <Input
              name="departureStation"
              type="text"
              placeholder="Ga đi"
              className="w-full mt-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ga đến</label>
            <Input
              name="arrivalStation"
              type="text"
              placeholder="Ga đến"
              className="w-full mt-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Loại vé</label>
            <div className="flex items-center space-x-3 mt-1">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  defaultChecked
                />
                <span className="text-sm">Một chiều</span>
              </label>
              <label className="flex items-center space-x-1">
                <input type="radio" name="tripType" value="round-trip" />
                <span className="text-sm">Khứ hồi</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Ngày đi</label>
            <Input
              name="departureDate"
              type="date"
              className="w-full mt-1 text-sm"
              placeholder="Đi ngày"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Ngày về</label>
            <Input
              name="returnDate"
              type="date"
              className="w-full mt-1 text-sm"
              placeholder="Đến ngày"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </form>
  );
}
