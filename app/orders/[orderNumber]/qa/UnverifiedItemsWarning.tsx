import { useOrder } from "@/store/orderSlice"
import { LuTriangleAlert } from "react-icons/lu"

const UnverifiedItemsWarning = () => {
  const { order } = useOrder()

  const packages = order?.packages ?? []
  const items = order?.items ?? []

  const unverifiedPackageCount = packages.filter(pkg => {
    const pkgItems = items.filter(i => i.packageId === pkg.id)
    return pkgItems.length > 0 && !pkgItems.every(i => i.isQAVerified)
  }).length

  if (unverifiedPackageCount === 0) return null

  return (
    <div className="alert alert-warning text-lg">
      <LuTriangleAlert className="size-6" />
      <span>
        <strong>{unverifiedPackageCount}</strong> {unverifiedPackageCount === 1 ? 'package has' : 'packages have'} items that have not been verified.
      </span>
    </div>
  )
}

export default UnverifiedItemsWarning
