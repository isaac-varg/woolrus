import { PickStatus } from "@/prisma/generated/enums"
import Pending from "./_components/pending/Pending"

type Props = {
  searchParams: Promise<{
    status: PickStatus
  }>
}

const Orders = async ({ searchParams }: Props) => {

  const { status } = await searchParams;

  switch (status) {
    case 'PENDING':
      return <Pending />
    default:
      return false;
  }



}

export default Orders
