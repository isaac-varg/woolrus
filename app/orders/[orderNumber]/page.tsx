import { getOrder } from "@/actions/orders/getOrder"

type Props = {
  searchParams: Promise<{
    id: number
  }>
}

const OrderPage = async ({ searchParams }: Props) => {


  const { id } = await searchParams
  const order = await getOrder(id)

  switch (order.workflowStatus) {
    case 'PENDING':
      return <div>{JSON.stringify(order, null, 2)}</div>
    default:
      return false
  }

}

export default OrderPage 
