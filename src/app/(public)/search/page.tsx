import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import SearchTicket from "../search-ticket";
import TrainTicketBooking from "../train-booking";
export default async function Search() {
  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
      <div className="col-span-3 border rounded-lg bg-white shadow-md p-4">
        <div className="text-sm font-medium"></div>
        <TrainTicketBooking />
      </div>

      <div className="w-full">
        <div className=" w-full border rounded-lg w-72 bg-white shadow-md p-4">
          <div className="text-base font-semibold border-b pb-2 mb-2">
            Giỏ Vé
          </div>
          <div className="flex flex-col space-y-3">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est
            facilis molestias, recusandae et fuga voluptas vero distinctio earum
            fugiat minima autem aliquam nihil necessitatibus beatae expedita
            ipsam odio nemo ullam. Eaque, adipisci iure ex labore perspiciatis
          </div>
        </div>
        <div className="mt-5 w-full border rounded-lg w-72 bg-white shadow-md p-4">
          <div>
            <SearchTicket />
          </div>
        </div>
      </div>
    </div>
  );
}
