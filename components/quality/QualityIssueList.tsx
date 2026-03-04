'use client'

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Order } from "@/actions/orders/getOrder"
import QualityIssueCard from "./QualityIssueCard"

type QualityIssue = Order['qualityIssues'][number]

type Filter = 'all' | 'open' | 'resolved'

type Props = {
  issues: QualityIssue[]
}

const QualityIssueList = ({ issues }: Props) => {
  const t = useTranslations('qualityIssue')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = issues.filter((issue) => {
    if (filter === 'open') return !issue.resolvedAt
    if (filter === 'resolved') return !!issue.resolvedAt
    return true
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{t('title')}</h3>
        <div className="join">
          {(['all', 'open', 'resolved'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`join-item btn btn-xs ${filter === f ? 'btn-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {t(`filter${f.charAt(0).toUpperCase() + f.slice(1)}` as 'filterAll' | 'filterOpen' | 'filterResolved')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-base-content/50">{t('noIssues')}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((issue) => (
            <QualityIssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  )
}

export default QualityIssueList
