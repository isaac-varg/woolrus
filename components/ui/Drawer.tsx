'use client'

import { useId, type ReactNode } from "react"
import { useDrawer, useDrawerActions } from "@/store/drawerSlice"

type Props = {
  children: ReactNode
}

const Drawer = ({ children }: Props) => {
  const id = useId()
  const isOpen = useDrawer((state) => state.isOpen)
  const { close } = useDrawerActions()

  return (
    <div className="drawer drawer-end">
      <input
        id={id}
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={() => close()}
      />
      <div className="drawer-side z-50">
        <label htmlFor={id} className="drawer-overlay" />
        <div className="bg-base-100 min-h-full w-1/5 p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Drawer
