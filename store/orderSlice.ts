import { Order } from '@/actions/orders/getOrder';
import { PickStatus } from '@/prisma/generated/enums';
import { create } from 'zustand'

interface OrderState {
  order: Order | null
}

interface OrderActions {
  actions: {
    setOrder: (order: Order | null) => void;
    syncItems: (items: Order['items']) => void;
    updateItemPickStatus: (itemId: string, status: PickStatus) => void;
    updateItemPackStatus: (itemId: string, isPacked: boolean) => void;
    updateItemQAStatus: (itemId: string, isQAVerified: boolean) => void;
    assignItemToPackage: (itemId: string, packageId: string) => void;
    removeItemFromPackage: (itemId: string) => void;
    voidItem: (itemId: string) => void;
    unvoidItem: (itemId: string) => void;
    addQualityIssue: (issue: Order['qualityIssues'][number]) => void;
    removeQualityIssue: (issueId: string) => void;
    updateQualityIssue: (issueId: string, updates: Partial<Order['qualityIssues'][number]>) => void;
  }
}

export const useOrder = create<OrderState & OrderActions>((set) => ({
  order: null,

  actions: {
    setOrder: (order) => set(() => ({ order })),
    syncItems: (items) => set((state) => {
      if (!state.order) return state
      return { order: { ...state.order, items } }
    }),
    updateItemPickStatus: (itemId, status) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          items: state.order.items.map((item) =>
            item.id === itemId ? { ...item, pickStatus: status } : item
          ),
        },
      }
    }),
    updateItemPackStatus: (itemId, isPacked) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          items: state.order.items.map((item) =>
            item.id === itemId ? { ...item, isPacked } : item
          ),
        },
      }
    }),
    updateItemQAStatus: (itemId, isQAVerified) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          items: state.order.items.map((item) =>
            item.id === itemId ? { ...item, isQAVerified } : item
          ),
        },
      }
    }),
    assignItemToPackage: (itemId, packageId) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          items: state.order.items.map((item) =>
            item.id === itemId ? { ...item, packageId } : item
          ),
        },
      }
    }),
    removeItemFromPackage: (itemId) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          items: state.order.items.map((item) =>
            item.id === itemId ? { ...item, packageId: null } : item
          ),
        },
      }
    }),
    voidItem: (itemId) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          items: state.order.items.map((item) =>
            item.id === itemId ? { ...item, isVoided: true } : item
          ),
        },
      }
    }),
    unvoidItem: (itemId) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          items: state.order.items.map((item) =>
            item.id === itemId ? { ...item, isVoided: false, packageId: null } : item
          ),
        },
      }
    }),
    addQualityIssue: (issue) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          qualityIssues: [...state.order.qualityIssues, issue],
        },
      }
    }),
    removeQualityIssue: (issueId) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          qualityIssues: state.order.qualityIssues.filter((i) => i.id !== issueId),
        },
      }
    }),
    updateQualityIssue: (issueId, updates) => set((state) => {
      if (!state.order) return state
      return {
        order: {
          ...state.order,
          qualityIssues: state.order.qualityIssues.map((i) =>
            i.id === issueId ? { ...i, ...updates } : i
          ),
        },
      }
    }),
  }
}))

export const useOrderActions = () => useOrder((state) => state.actions)
