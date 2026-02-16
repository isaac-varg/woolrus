'use client'
import { useRouter } from "next/navigation"
import type { IconType } from "react-icons";

export type SidebarButton = {
  path: string
  title: string
  icon?: IconType
}

const SidebarButton = ({ path, title, icon }: SidebarButton) => {
  const router = useRouter()


  return (
    <button
      onClick={() => router.push(path)}
      className="btn btn-lg btn-primary w-full">
      {title}
    </button>

  )
}

export default SidebarButton
