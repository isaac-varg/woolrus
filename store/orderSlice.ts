import { Order } from '@/actions/orders/getOrder';
import { create } from 'zustand'

interface OrderState {
  order: Order | null
}

interface OrderActions {
  actions: {
    setOrder: (order: Order | null) => void;
  }
}

export const useOrder = create<OrderState & OrderActions>((set) => ({
  order: null,

  actions: {
    setOrder: (order) => set(() => ({ order })),
  }
}))

export const useOrderActions = () => useOrder((state) => state.actions)
