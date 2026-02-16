import { SidebarButton } from "@/components/app/SidebarButton";

export const links: SidebarButton[] = [
  {
    path: '/orders?status=PENDING',
    title: 'Pending',
  },
  {
    path: '/orders?status=PICKING',
    title: 'Picking',
  },
  {
    path: '/orders?status=PACKING',
    title: 'Packing',
  },
  {
    path: '/orders?status=QA',
    title: 'Quality',
  },
]
