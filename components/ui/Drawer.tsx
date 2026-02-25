'use client'

import { forwardRef, useImperativeHandle, useId, useState, type ReactNode } from "react"

export type DrawerHandle = {
  open: () => void
  close: () => void
  toggle: () => void
}

type Props = {
  children: ReactNode
}

const Drawer = forwardRef<DrawerHandle, Props>(({ children }, ref) => {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  }))

  return (
    <div className="drawer drawer-end">
      <input
        id={id}
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />
      <div className="drawer-side z-50">
        <label htmlFor={id} className="drawer-overlay" />
        <div className="bg-base-100 min-h-full w-1/5 p-4">
          {children}
        </div>
      </div>
    </div>
  )
})

Drawer.displayName = "Drawer"

export default Drawer
