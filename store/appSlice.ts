import { create } from 'zustand'

interface AppState {
  activeTheme: string
  isSidebarCollapsed: boolean
}

interface AppActions {
  actions: {
    setActiveTheme: (theme: string) => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
  }
}

export const useApp = create<AppState & AppActions>((set) => ({
  activeTheme: 'dark',
  isSidebarCollapsed: false,

  actions: {
    setActiveTheme: (theme: string) => set(() => ({ activeTheme: theme })),
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    setSidebarCollapsed: (collapsed: boolean) => set(() => ({ isSidebarCollapsed: collapsed })),
  }
}))

export const useAppActions = () => useApp((state) => state.actions)
