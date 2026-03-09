'use client'

import { useRef, useState } from "react"
import { LuBan } from "react-icons/lu"
import { voidItem } from "@/actions/orders/voidItem"
import { useOrderActions } from "@/store/orderSlice"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

type Props = {
  itemId: string
}

const VoidItemButton = ({ itemId }: Props) => {
  const router = useRouter()
  const t = useTranslations('void')
  const { voidItem: voidLocal } = useOrderActions()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpen = () => dialogRef.current?.showModal()
  const handleClose = () => {
    dialogRef.current?.close()
    setReason('')
    setIsSubmitting(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      voidLocal(itemId)
      await voidItem(itemId, reason.trim() || undefined)
      handleClose()
    } catch {
      setIsSubmitting(false)
    } finally {
      router.refresh()
    }
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm btn-error" onClick={handleOpen}>
        <LuBan className="size-4" />
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">{t('voidItem')}</h3>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder={t('reasonPlaceholder')}
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="modal-action">
            <button className="btn" onClick={handleClose} disabled={isSubmitting}>
              {t('cancel')}
            </button>
            <button
              className="btn btn-error"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : t('confirm')}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </>
  )
}

export default VoidItemButton
