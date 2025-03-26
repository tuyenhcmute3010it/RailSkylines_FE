import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchTicket() {
  return (
    <div>
      <div className="text-base font-semibold border-b pb-2 mb-2">
        Thông tin hành trình
      </div>
      <div className="flex flex-col space-y-3">
        <div>
          <label className="block text-sm font-medium">Ga đi</label>
          <Input
            type="text"
            placeholder="Ga đi"
            className="w-full mt-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ga đến</label>
          <Input
            type="text"
            placeholder="Ga đến"
            className="w-full mt-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Loại vé</label>
          <div className="flex items-center space-x-3 mt-1">
            <label className="flex items-center space-x-1">
              <input type="radio" name="tripType" defaultChecked />
              <span className="text-sm">Một chiều</span>
            </label>
            <label className="flex items-center space-x-1">
              <input type="radio" name="tripType" />
              <span className="text-sm">Khứ hồi</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Ngày đi</label>
          <Input
            type="date"
            className="w-full mt-1 text-sm"
            placeholder="Đi ngày"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Ngày về</label>
          <Input
            placeholder="Đến ngày"
            type="date"
            className="w-full mt-1 text-sm"
          />
        </div>
        <Button className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700">
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
