'use client'
import { getOrder, Order } from "@/actions/orders/getOrder"
import { useDataActions } from "@/store/dataSlice"
import { useOrderActions } from "@/store/orderSlice"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

type StateProps = {
  order: Order
}

const State = ({ order }: StateProps) => {

  const { setOrder } = useOrderActions()
  const { handleBoxes } = useDataActions()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')

  // hydrate from server prop immediately
  useEffect(() => {
    setOrder(order)
  }, [order, setOrder])

  //jrefetch when URL changes but server prop is stale (client-side navigation)
  useEffect(() => {
    if (orderId && orderId !== order.id) {
      getOrder(orderId).then(setOrder)
    }
  }, [orderId, order.id, setOrder])

  useEffect(() => {
    handleBoxes()
  }, [])


  return false;

}

export default State
