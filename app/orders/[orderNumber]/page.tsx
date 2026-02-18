import { getOrder } from "@/actions/orders/getOrder"
import Picking from "./picking/Picking"
import Pending from "./pending/Pending"
import State from "./shared/State"

type Props = {
  searchParams: Promise<{
    id: string
  }>
}

const OrderPage = async ({ searchParams }: Props) => {

  const { id } = await searchParams
  const order = await getOrder(id)

  // switching the content so we can set the zustand state
  let content;

  switch (order.workflowStatus) {
    case 'PENDING':
      content = <Pending />
      break
    default:
      content = null
  }

  return (
    <>
      <State
        order={order}
      />
      {content}
    </>
  )

}

export default OrderPage 
