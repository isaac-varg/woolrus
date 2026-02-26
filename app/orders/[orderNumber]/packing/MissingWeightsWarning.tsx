import { useOrder } from "@/store/orderSlice"
import { LuTriangleAlert } from "react-icons/lu"
import { useTranslations } from "next-intl"

const MissingWeightsWarning = () => {
  const { order } = useOrder()
  const t = useTranslations('orderPacking')

  const missingCount = order?.packages.filter(p => p.weight == null).length ?? 0

  if (missingCount === 0) return null

  return (
    <div className="alert alert-warning text-lg">
      <LuTriangleAlert className="size-6" />
      <span>{t('missingWeights', { count: missingCount })}</span>
    </div>
  )
}

export default MissingWeightsWarning
