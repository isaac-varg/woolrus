import { getOrder } from "@/actions/orders/getOrder"

type Props = {
  params: {
    orderId: number
  }
}

const OrderPage = async ({ params }: Props) => {

  const order = await getOrder(params.orderId)

  switch (order.pickStatus) {
    case 'PENDING':
      return <div>pending</div>
    default:
      return false
  }

}

export default OrderPage 
