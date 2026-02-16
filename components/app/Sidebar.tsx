"use client";

import Image from "next/image";
import { Fragment, useEffect } from "react";
import { useApp, useAppActions } from "@/store/appSlice";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand, TbLayoutSidebarRightCollapse } from "react-icons/tb";

export default function Sidebar({
  initialCollapsed,
}: {
  initialCollapsed: boolean;
}) {
  const { isSidebarCollapsed } = useApp()
  const { toggleSidebar, setSidebarCollapsed } = useAppActions();

  useEffect(() => {
    setSidebarCollapsed(initialCollapsed);
  }, [initialCollapsed, setSidebarCollapsed]);

  return (
    <aside
      className={`h-screen flex flex-col justify-between bg-base-100 border-r border-base-300 transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-64"
        }`}
    >
      {/* Top: Logo + Branding */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Image
          src="/logos/woolrus.png"
          alt="Woolrus"
          width={32}
          height={32}
          className="shrink-0"
        />
        {!isSidebarCollapsed && (
          <span className="text-lg font-semibold whitespace-nowrap">
            Woolrus
          </span>
        )}
      </div>

      {/* Bottom: Sync info + Toggle */}
      <div className="flex flex-col gap-2 px-4 py-4">
        {!isSidebarCollapsed && (
          <span className="text-xs text-base-content/50">
            Last Sync: 2 minutes ago
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
              Collapse Sidebar
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
