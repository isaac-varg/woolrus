'use client'

import { useState } from "react"
import { LuTrash2 } from "react-icons/lu"
import { deleteQualityIssue } from "@/actions/quality/deleteQualityIssue"
import { useOrderActions } from "@/store/orderSlice"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Order } from "@/actions/orders/getOrder"
import ResolveIssueDialog from "./ResolveIssueDialog"

type QualityIssue = Order['qualityIssues'][number]

type Props = {
  issue: QualityIssue
}

const severityColor: Record<string, string> = {
  MINOR: 'badge-info',
  MAJOR: 'badge-warning',
  CRITICAL: 'badge-error',
}

const QualityIssueCard = ({ issue }: Props) => {
  const router = useRouter()
  const t = useTranslations('qualityIssue')
  const tStatus = useTranslations('orderDetail.status')
  const { removeQualityIssue } = useOrderActions()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm'))) return
    setIsDeleting(true)
    try {
      await deleteQualityIssue(issue.id)
      removeQualityIssue(issue.id)
      router.refresh()
    } catch {
      setIsDeleting(false)
    }
  }

  const isResolved = !!issue.resolvedAt

  return (
    <div className={`card card-bordered bg-base-100 shadow-sm ${isResolved ? 'opacity-70' : ''}`}>
      <div className="card-body p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <span className={`badge ${severityColor[issue.severity]}`}>
              {t(`severities.${issue.severity}`)}
            </span>
            <span className="badge badge-outline">
              {t(`types.${issue.type}`)}
            </span>
            {issue.isCustomerReported && (
              <span className="badge badge-secondary">{t('customerReported')}</span>
            )}
            {isResolved && (
              <span className="badge badge-success">{t('resolved')}</span>
            )}
          </div>
          <div className="flex gap-1">
            {!isResolved && <ResolveIssueDialog issue={issue} />}
            <button
              className="btn btn-ghost btn-xs"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <LuTrash2 className="size-4" />
            </button>
          </div>
        </div>

        {issue.description && (
          <p className="text-sm">{issue.description}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-content/60">
          {issue.orderItem && (
            <span>{issue.orderItem.name}</span>
          )}
          <span>{t('reportedBy')} {issue.reportedBy.name}</span>
          {issue.stageOriginated && (
            <span>{t('stageOriginated')}: {tStatus(issue.stageOriginated)}</span>
          )}
          {isResolved && issue.resolvedBy && (
            <span>{t('resolvedBy')} {issue.resolvedBy.name}</span>
          )}
        </div>

        {isResolved && issue.resolutionNotes && (
          <p className="text-sm text-base-content/70 italic">{issue.resolutionNotes}</p>
        )}

        {issue.notes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {issue.notes.flatMap(n => n.attachments).map((att) => (
              <a key={att.id} href={(att as { url?: string }).url} target="_blank" rel="noreferrer">
                <img
                  src={(att as { url?: string }).url}
                  alt=""
                  className="w-16 h-16 object-cover rounded border"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QualityIssueCard
