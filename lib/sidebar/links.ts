import { SidebarButton } from "@/components/app/SidebarButton";

export const links: SidebarButton[] = [
  {
    path: '/orders?status=PENDING',
    title: 'sidebar.pending',
  },
  {
    path: '/orders?status=PICKING',
    title: 'sidebar.picking',
  },
  {
    path: '/orders?status=PACKING',
    title: 'sidebar.packing',
  },
  {
    path: '/orders?status=QA',
    title: 'sidebar.quality',
  },
]
