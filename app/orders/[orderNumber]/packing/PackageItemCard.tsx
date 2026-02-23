import { FaTimes } from "react-icons/fa";
import { Order } from "@/actions/orders/getOrder"
import Image from "next/image"

type Props = {
  item: Order['items'][number];
  onClick?: (item: Order['items'][number]) => void;
}

const PackageItemCard = ({ item, onClick }: Props) => {

  const attributes = item.attributes as Record<string, string> | null

  return (
    <div
      onClick={() => onClick?.(item)}
      className={`relative card card-side shadow-md border-2 border-transparent h-60 bg-base-100 overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >

      {item.imageUrl && (
        <figure className="w-56 shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={512}
            height={512}
            className="h-full w-full object-cover"
          />
        </figure>
      )}

      <div className="card-body gap-1 py-4">
        <div className="font-semibold text-2xl text-base-content">{item.name}</div>

        {item.sku && (
          <div className="text-lg text-base-content/60">SKU: {item.sku}</div>
        )}

        {attributes && Object.entries(attributes).map(([key, value]) => (
          <div key={key} className="text-2xl text-base-content/60">
            {key}: <span className="text-base-content">{value}</span>
          </div>
        ))}

        <div className="card-actions flex items-center gap-2 mt-2">
          <div className="text-base-content/60">
            <FaTimes className="size-8" />
          </div>
          <span className="font-semibold text-5xl text-base-content">{item.quantity}</span>
        </div>
      </div>

    </div>
  )
}

export default PackageItemCard
