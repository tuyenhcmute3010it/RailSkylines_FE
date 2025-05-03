import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";

export default async function DishDetail({
  dish,
}: {
  dish: DishResType["data"] | undefined;
}) {
  if (!dish)
    return (
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">
          Món Ăn Không Tồn Tại
        </h1>
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
      <div className="font-semibold">Gia : {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        alt={dish.name}
        height={300}
        width={300}
        quality={100}
        className="object-cover w-[300px] h-[300px] rounded-md"
        title={dish.name}
      />
      <p>{dish.description}</p>
    </div>
  );
}
