'use client'

import { useRef, useState } from "react"
import { LuCircleCheck } from "react-icons/lu"
import { resolveVoid } from "@/actions/orders/resolveVoid"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

type Props = {
  voidId: string
  reason?: string | null
}

const ResolveVoidDialog = ({ voidId, reason }: Props) => {
  const router = useRouter()
  const t = useTranslations('void')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpen = () => dialogRef.current?.showModal()
  const handleClose = () => {
    dialogRef.current?.close()
    setResolutionNotes('')
    setIsSubmitting(false)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await resolveVoid(voidId, resolutionNotes.trim() || undefined)
      handleClose()
    } catch {
      setIsSubmitting(false)
    } finally {
      router.refresh()
    }
  }

  return (
    <>
      <button className="btn btn-ghost btn-xs" onClick={handleOpen}>
        <LuCircleCheck className="size-4" />
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">{t('resolveVoid')}</h3>

          {reason && (
            <p className="text-sm text-base-content/70">{reason}</p>
          )}

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder={t('resolutionPlaceholder')}
            rows={3}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
          />

          <div className="modal-action">
            <button className="btn" onClick={handleClose} disabled={isSubmitting}>
              {t('cancel')}
            </button>
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : t('resolve')}
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

export default ResolveVoidDialog
