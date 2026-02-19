import { Order } from '@/actions/orders/getOrder';
import { PickStatus } from '@/prisma/generated/enums';
import { create } from 'zustand'

interface OrderState {
  order: Order | null
}

interface OrderActions {
  actions: {
    setOrder: (order: Order | null) => void;
    updateItemPickStatus: (itemId: string, status: PickStatus) => void;
    updateItemPackStatus: (itemId: string, isPacked: boolean) => void;
    assignItemToPackage: (itemId: string, packageId: string) => void;
    removeItemFromPackage: (itemId: string) => void;
  }
}

export const useOrder = create<OrderState & OrderActions>((set) => ({
  order: null,

  actions: {
    setOrder: (order) => set(() => ({ order })),
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
  }
}))

export const useOrderActions = () => useOrder((state) => state.actions)
