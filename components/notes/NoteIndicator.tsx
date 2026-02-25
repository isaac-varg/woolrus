'use client'

import { LuMessageCircle } from "react-icons/lu"
import { useDrawerActions } from "@/store/drawerSlice"

type Props = {
  count: number
}

const NoteIndicator = ({ count }: Props) => {
  const { open } = useDrawerActions()

  if (count === 0) return null

  return (
    <button
      className="btn btn-info flex gap-2"
      onClick={(e) => {
        e.stopPropagation()
        open()
      }}
    >
      <LuMessageCircle className="size-6" />
      <span className="font-semibold">{count}</span>
    </button>
  )
}

export default NoteIndicator
