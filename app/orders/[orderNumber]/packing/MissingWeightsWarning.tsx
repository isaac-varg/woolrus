import { useOrder } from "@/store/orderSlice"
import { LuTriangleAlert } from "react-icons/lu"

const MissingWeightsWarning = () => {
  const { order } = useOrder()

  const missingCount = order?.packages.filter(p => p.weight == null).length ?? 0

  if (missingCount === 0) return null

  return (
    <div className="alert alert-warning text-lg">
      <LuTriangleAlert className="size-6" />
      <span>
        <strong>{missingCount}</strong> {missingCount === 1 ? 'package does' : 'packages do'} not have a weight set.
      </span>
    </div>
  )
}

export default MissingWeightsWarning
