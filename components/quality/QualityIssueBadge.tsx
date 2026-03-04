'use client'

import { LuShieldAlert } from "react-icons/lu"
import { useDrawerActions } from "@/store/drawerSlice"

type Props = {
  count: number
  hasCritical?: boolean
}

const QualityIssueBadge = ({ count, hasCritical }: Props) => {
  const { open } = useDrawerActions()

  if (count === 0) return null

  return (
    <button
      className={`btn flex gap-2 ${hasCritical ? 'btn-error' : 'btn-warning'}`}
      onClick={(e) => {
        e.stopPropagation()
        open()
      }}
    >
      <LuShieldAlert className="size-6" />
      <span className="font-semibold">{count}</span>
    </button>
  )
}

export default QualityIssueBadge
