'use client'
import { Order } from "@/actions/orders/getOrder"
import { useOrderActions } from "@/store/orderSlice"
import { useEffect } from "react"

type StateProps = {
  order: Order
}

const State = ({ order }: StateProps) => {

  const { setOrder } = useOrderActions()

  useEffect(() => {

    setOrder(order)

  }, [
    order, setOrder
  ])


  return false;

}

export default State
