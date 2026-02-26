import { getOrder } from "@/actions/orders/getOrder"
import Picking from "./picking/Picking"
import Pending from "./pending/Pending"
import State from "./shared/State"
import Packing from "./packing/Packing"
import QA from "./qa/QA"

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
    case "PICKING":
      content = <Picking />
      break
    case "PACKING":
      content = <Packing />
      break
    case "QA":
      content = <QA />
      break
    default:
      content = null
  }

  return (
    <>
      <State
        key={order.id}
        order={order}
      />
      {content}
    </>
  )

}

export default OrderPage 
