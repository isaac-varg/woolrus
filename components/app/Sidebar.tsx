"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useApp, useAppActions } from "@/store/appSlice";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { links } from "@/lib/sidebar/links";
import SidebarButton from "./SidebarButton";
import { useTranslations } from "next-intl";

export default function Sidebar({
  initialCollapsed,
}: {
  initialCollapsed: boolean;
}) {
  const { isSidebarCollapsed } = useApp()
  const { toggleSidebar, setSidebarCollapsed } = useAppActions();
  const t = useTranslations();

  useEffect(() => {
    setSidebarCollapsed(initialCollapsed);
  }, [initialCollapsed, setSidebarCollapsed]);

  return (
    <aside
      className={`h-screen flex flex-col px-4 py-8 bg-base-100  justify-between  border-r border-base-300 transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-64"
        }`}
    >
      {/* Top: Logo + Branding */}
      <div className="flex flex-col gap-6 ">
        <div className="flex items-center gap-3  ">
          <Image
            src="/logos/woolrus.png"
            alt="Woolrus"
            width={64}
            height={64}
            className="shrink-0"
          />
          {!isSidebarCollapsed && (
            <span className="text-3xl text-primary-content font-semibold whitespace-nowrap">
              Woolrus
            </span>
          )}
        </div>

        <div
          className="flex flex-col gap-6"
        >
          {links.map(link => <SidebarButton
            key={link.title}
            title={t(link.title)}
            path={link.path}
            icon={link.icon}
          />
          )}
        </div>

      </div>



      {/* Bottom Stuff - Sync + collapse */}
      <div className="flex flex-col gap-2 py-4">
        {!isSidebarCollapsed && (
          <span className="text-xs text-base-content/50">
            {t('sidebar.lastSync')}
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className={`btn btn-outline w-full transition-all duration-300 flex ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >

          {isSidebarCollapsed ? (
            <div>
              <TbLayoutSidebarLeftExpand className="size-6" />
            </div>
          ) : (
            <div className="flex gap-2">
              <TbLayoutSidebarLeftCollapse className="size-6" />
              {t('sidebar.collapse')}
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
