import { create } from 'zustand'

interface DrawerState {
  isOpen: boolean
}

interface DrawerActions {
  actions: {
    open: () => void
    close: () => void
    toggle: () => void
  }
}

export const useDrawer = create<DrawerState & DrawerActions>((set) => ({
  isOpen: false,

  actions: {
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  }
}))

export const useDrawerActions = () => useDrawer((state) => state.actions)
