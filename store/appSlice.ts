import { create } from 'zustand'

interface AppState {
  activeTheme: string
}

interface AppActions {
  actions: {
    setActiveTheme: (theme: string) => void;
  }
}

export const useApp = create<AppState & AppActions>((set) => ({
  activeTheme: 'dark',

  actions: {
    setActiveTheme: (theme: string) => set(() => ({ activeTheme: theme })),

  }
}))

export const useAppActions = () => useApp((state) => state.actions)
