import { FaTimes } from "react-icons/fa"
import { LuCircle, LuCircleCheckBig, LuUndo2 } from "react-icons/lu"
import { TbUser } from "react-icons/tb"
import { Order } from "@/actions/orders/getOrder"
import Image from "next/image"
import AddNoteDialog from "@/components/notes/AddNoteDialog"
import NoteIndicator from "@/components/notes/NoteIndicator"
import ReportIssueDialog from "@/components/quality/ReportIssueDialog"
import QualityIssueBadge from "@/components/quality/QualityIssueBadge"
import VoidItemButton from "@/components/void/VoidItemButton"
import { unvoidItem } from "@/actions/orders/unvoidItem"
import { useOrder, useOrderActions } from "@/store/orderSlice"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

type Props = {
  item: Order['items'][number]
  completed?: boolean
  onToggle?: (item: Order['items'][number]) => void
}

const QAItemCard = ({ item, completed, onToggle }: Props) => {
  const { order } = useOrder()
  const { unvoidItem: unvoidLocal } = useOrderActions()
  const router = useRouter()
  const tVoid = useTranslations('void')
  const attributes = item.attributes as { name: string; value: string }[] | null
  const itemIssues = order?.qualityIssues.filter(i => i.orderItemId === item.id) ?? []
  const hasCritical = itemIssues.some(i => i.severity === 'CRITICAL' && !i.resolvedAt)

  const handleUnvoid = async () => {
    unvoidLocal(item.id)
    await unvoidItem(item.id)
    router.refresh()
  }

  return (
    <div
      onClick={() => !item.isVoided && onToggle?.(item)}
      className={`relative card card-side shadow-md border-2 transition-colors ${item.isVoided ? 'opacity-50 border-error/30 bg-base-200' : onToggle ? 'cursor-pointer' : ''} ${!item.isVoided && completed ? 'border-success bg-success/20' : !item.isVoided ? 'border-transparent bg-base-100' : ''}`}
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
          {order && (
            <ReportIssueDialog
              orderId={order.id}
              orderItemId={item.id}
              stageDiscovered="QA"
              className="btn btn-outline btn-warning btn-sm"
            />
          )}
          <QualityIssueBadge count={itemIssues.length} hasCritical={hasCritical} />
          {item.isVoided ? (
            <button className="btn btn-ghost btn-sm" onClick={handleUnvoid}>
              <LuUndo2 className="size-4" />
              {tVoid('unvoid')}
            </button>
          ) : (
            <VoidItemButton itemId={item.id} />
          )}
        </div>
      </div>

      {item.isVoided && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <span className="badge badge-error badge-lg text-lg font-bold">{tVoid('voided')}</span>
        </div>
      )}

      {!item.isVoided && onToggle && (
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
