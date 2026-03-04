'use client'

import { useRef, useState } from "react"
import { LuCircleCheck } from "react-icons/lu"
import { resolveQualityIssue } from "@/actions/quality/resolveQualityIssue"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Order } from "@/actions/orders/getOrder"

type QualityIssue = Order['qualityIssues'][number]

type Props = {
  issue: QualityIssue
}

const ResolveIssueDialog = ({ issue }: Props) => {
  const router = useRouter()
  const t = useTranslations('qualityIssue')
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
      await resolveQualityIssue(issue.id, resolutionNotes.trim() || undefined)
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
          <h3 className="font-bold text-lg">{t('resolveIssue')}</h3>

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-outline">{t(`types.${issue.type}`)}</span>
            <span className="badge badge-outline">{t(`severities.${issue.severity}`)}</span>
          </div>

          {issue.description && (
            <p className="text-sm text-base-content/70">{issue.description}</p>
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

export default ResolveIssueDialog
