import { FaTimes } from "react-icons/fa"
import { LuCircle, LuCircleCheckBig } from "react-icons/lu"
import { TbUser } from "react-icons/tb"
import { Order } from "@/actions/orders/getOrder"
import Image from "next/image"
import AddNoteDialog from "@/components/notes/AddNoteDialog"
import NoteIndicator from "@/components/notes/NoteIndicator"

type Props = {
  item: Order['items'][number]
  completed?: boolean
  onToggle?: (item: Order['items'][number]) => void
}

const QAItemCard = ({ item, completed, onToggle }: Props) => {

  const attributes = item.attributes as { name: string; value: string }[] | null

  return (
    <div
      onClick={() => onToggle?.(item)}
      className={`relative card card-side shadow-md border-2 transition-colors ${onToggle ? 'cursor-pointer' : ''} ${completed ? 'border-success bg-success/20' : 'border-transparent bg-base-100'}`}
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

        {attributes?.map(attr => (
          <div key={attr.name} className="text-2xl text-base-content/60">
            {attr.name}: <span className="text-base-content">{attr.value}</span>
          </div>
        ))}

        <div className="card-actions flex items-center gap-2 mt-2">
          <div className="text-base-content/60">
            <FaTimes className="size-8" />
          </div>
          <span className="font-semibold text-5xl text-base-content">{item.quantity}</span>
        </div>

        {item.pickedBy && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base-content/60 text-sm">Picked by</span>
            {item.pickedBy.image ? (
              <Image
                src={item.pickedBy.image}
                alt={item.pickedBy.name ?? ''}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="size-6 rounded-full bg-base-300 flex items-center justify-center">
                <TbUser className="size-4 text-base-content/60" />
              </div>
            )}
            <span className="text-sm font-semibold text-base-content">{item.pickedBy.name}</span>
          </div>
        )}

        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <AddNoteDialog orderItemId={item.id} />
          <NoteIndicator count={item.notes?.length ?? 0} />
        </div>
      </div>

      {onToggle && (
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${completed ? 'text-success' : 'text-base-content/40'}`}>
          {completed
            ? <LuCircleCheckBig className="size-10" />
            : <LuCircle className="size-10" />
          }
        </div>
      )}

    </div>
  )
}

export default QAItemCard
