'use client'
import { Order } from "@/actions/orders/getOrder"
import { useDataActions } from "@/store/dataSlice"
import { useOrderActions } from "@/store/orderSlice"
import { useEffect } from "react"

type StateProps = {
  order: Order
}

const State = ({ order }: StateProps) => {

  const { setOrder } = useOrderActions()
  const { handleBoxes } = useDataActions()

  useEffect(() => {

    setOrder(order)

  }, [
    order, setOrder
  ])

  useEffect(() => {
    handleBoxes()
  }, [])


  return false;

}

export default State
