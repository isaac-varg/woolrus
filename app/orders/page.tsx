import { WorkflowStatus } from "@/prisma/generated/enums"
import OrdersPending from "./_components/pending/Pending"
import OrdersPicking from "./_components/picking/Picking"
import OrdersPacking from "./_components/packing/Packing"
import OrdersQA from "./_components/qa/QA"

type Props = {
  searchParams: Promise<{
    status: WorkflowStatus
  }>
}

const Orders = async ({ searchParams }: Props) => {

  const { status } = await searchParams;

  switch (status) {
    case 'PENDING':
      return <OrdersPending />
    case 'PICKING':
      return <OrdersPicking />
    case 'PACKING':
      return <OrdersPacking />
    case 'QA':
      return <OrdersQA />
    default:
      return false;
  }



}

export default Orders
