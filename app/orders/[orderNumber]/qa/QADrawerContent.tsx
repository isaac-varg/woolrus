import { useOrder } from "@/store/orderSlice"
import { formatDate } from "@/utils/date/formatDate"
import { TbClipboardList, TbUser, TbNotes, TbBox } from "react-icons/tb"
import Image from "next/image"
import NoteAttachments from "@/components/notes/NoteAttachments"

type ShippingAddress = {
  firstName?: string
  lastName?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
}

const QADrawerContent = () => {
  const { order } = useOrder()

  const shipping = order?.shippingAddress as ShippingAddress | null
  const workflow = order?.workflow

  const pickers = order?.items
    .flatMap(i => i.pickedBy ? [i.pickedBy] : [])
    .filter((user, index, self) => self.findIndex(u => u.id === user.id) === index)

  const packedBy = workflow?.packedBy

  const addressLines = [
    shipping?.address1,
    shipping?.address2,
    [shipping?.city, shipping?.state, shipping?.postcode].filter(Boolean).join(', '),
    shipping?.country,
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-6">

      <div className="text-xl font-bold text-base-content">Order Details</div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-base-content/60">
          <TbClipboardList className="size-5" />
          <span className="font-semibold text-sm uppercase tracking-wide">Order Basics</span>
        </div>
        <div className="flex flex-col gap-3 pl-7">
          <div className="flex flex-col">
            <span className="text-xs text-base-content/50">Created</span>
            <span className="text-sm font-medium text-base-content">
              {order?.wooCreatedAt ? formatDate(order.wooCreatedAt) : '—'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-base-content/50">Customer</span>
            <span className="text-sm font-medium text-base-content">{order?.customerName ?? '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-base-content/50">Shipping Address</span>
            {addressLines.length > 0 ? (
              <div className="text-sm font-medium text-base-content">
                {addressLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-base-content">—</span>
            )}
          </div>
        </div>
      </div>

      <div className="divider my-0" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-base-content/60">
          <TbUser className="size-5" />
          <span className="font-semibold text-sm uppercase tracking-wide">Picking</span>
        </div>
        <div className="flex flex-col gap-3 pl-7">
          {workflow?.pickStartedAt && (
            <div className="flex flex-col">
              <span className="text-xs text-base-content/50">Pick Started</span>
              <span className="text-sm font-medium text-base-content">
                {formatDate(workflow.pickStartedAt)}
              </span>
            </div>
          )}
          {workflow?.pickCompletedAt && (
            <div className="flex flex-col">
              <span className="text-xs text-base-content/50">Pick Completed</span>
              <span className="text-sm font-medium text-base-content">
                {formatDate(workflow.pickCompletedAt)}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-base-content/50">Picked By</span>
            {pickers && pickers.length > 0 ? (
              pickers.map(picker => (
                <div key={picker.id} className="flex items-center gap-2">
                  {picker.image ? (
                    <Image
                      src={picker.image}
                      alt={picker.name ?? ''}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="size-7 rounded-full bg-base-300 flex items-center justify-center">
                      <TbUser className="size-4 text-base-content/60" />
                    </div>
                  )}
                  <span className="text-sm font-bold text-base-content">{picker.name}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-base-content">—</span>
            )}
          </div>
        </div>
      </div>

      <div className="divider my-0" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-base-content/60">
          <TbBox className="size-5" />
          <span className="font-semibold text-sm uppercase tracking-wide">Packing</span>
        </div>
        <div className="flex flex-col gap-3 pl-7">
          {workflow?.packStartedAt && (
            <div className="flex flex-col">
              <span className="text-xs text-base-content/50">Pack Started</span>
              <span className="text-sm font-medium text-base-content">
                {formatDate(workflow.packStartedAt)}
              </span>
            </div>
          )}
          {workflow?.packCompletedAt && (
            <div className="flex flex-col">
              <span className="text-xs text-base-content/50">Pack Completed</span>
              <span className="text-sm font-medium text-base-content">
                {formatDate(workflow.packCompletedAt)}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-base-content/50">Packed By</span>
            {packedBy ? (
              <div className="flex items-center gap-2">
                {packedBy.image ? (
                  <Image
                    src={packedBy.image}
                    alt={packedBy.name ?? ''}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="size-7 rounded-full bg-base-300 flex items-center justify-center">
                    <TbUser className="size-4 text-base-content/60" />
                  </div>
                )}
                <span className="text-sm font-bold text-base-content">{packedBy.name}</span>
              </div>
            ) : (
              <span className="text-sm text-base-content">—</span>
            )}
          </div>
        </div>
      </div>

      <div className="divider my-0" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-base-content/60">
          <TbNotes className="size-5" />
          <span className="font-semibold text-sm uppercase tracking-wide">Notes</span>
        </div>
        <div className="flex flex-col gap-3 pl-7">
          {order?.orderNotes && (
            <div className="flex flex-col">
              <span className="text-xs text-base-content/50">Customer Note</span>
              <span className="text-sm font-medium text-base-content">{order.orderNotes}</span>
            </div>
          )}
          {order?.notes && order.notes.length > 0 ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-base-content/50">Order Notes</span>
              {order.notes.map(note => (
                <div key={note.id} className="flex flex-col gap-1 rounded-lg bg-base-200 p-2">
                  <div className="flex items-center gap-2">
                    {note.author.image ? (
                      <Image
                        src={note.author.image}
                        alt={note.author.name ?? ''}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="size-5 rounded-full bg-base-300 flex items-center justify-center">
                        <TbUser className="size-3 text-base-content/60" />
                      </div>
                    )}
                    <span className="text-xs font-bold text-base-content">{note.author.name}</span>
                    <span className="text-xs text-base-content/50">{formatDate(note.createdAt)}</span>
                  </div>
                  {note.content && <span className="text-sm text-base-content">{note.content}</span>}
                  <NoteAttachments attachments={note.attachments} thumbnail />
                </div>
              ))}
            </div>
          ) : !order?.orderNotes && (
            <span className="text-sm text-base-content/50">No notes</span>
          )}
          {order?.items.some(item => item.notes.length > 0) && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-base-content/50">Item Notes</span>
              {order.items.filter(item => item.notes.length > 0).map(item => (
                <div key={item.id} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-base-content">{item.name}</span>
                  {item.notes.map(note => (
                    <div key={note.id} className="flex flex-col gap-1 rounded-lg bg-base-200 p-2">
                      <div className="flex items-center gap-2">
                        {note.author.image ? (
                          <Image
                            src={note.author.image}
                            alt={note.author.name ?? ''}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="size-5 rounded-full bg-base-300 flex items-center justify-center">
                            <TbUser className="size-3 text-base-content/60" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-base-content">{note.author.name}</span>
                        <span className="text-xs text-base-content/50">{formatDate(note.createdAt)}</span>
                      </div>
                      {note.content && <span className="text-sm text-base-content">{note.content}</span>}
                      <NoteAttachments attachments={note.attachments} thumbnail />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {order?.packages.some(pkg => pkg.notes.length > 0) && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-base-content/50">Package Notes</span>
              {order.packages.filter(pkg => pkg.notes.length > 0).map((pkg, index) => (
                <div key={pkg.id} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-base-content">
                    Package {index + 1} — {pkg.box.name}
                  </span>
                  {pkg.notes.map(note => (
                    <div key={note.id} className="flex flex-col gap-1 rounded-lg bg-base-200 p-2">
                      <div className="flex items-center gap-2">
                        {note.author.image ? (
                          <Image
                            src={note.author.image}
                            alt={note.author.name ?? ''}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="size-5 rounded-full bg-base-300 flex items-center justify-center">
                            <TbUser className="size-3 text-base-content/60" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-base-content">{note.author.name}</span>
                        <span className="text-xs text-base-content/50">{formatDate(note.createdAt)}</span>
                      </div>
                      {note.content && <span className="text-sm text-base-content">{note.content}</span>}
                      <NoteAttachments attachments={note.attachments} thumbnail />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default QADrawerContent
