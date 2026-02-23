import { useOrder, useOrderActions } from "@/store/orderSlice"
import { useQA, useQAActions } from "@/store/qaSlice"
import { updateItemQAStatus } from "@/actions/orders/updateItemQAStatus"
import { Order } from "@/actions/orders/getOrder"
import { LuPackage, LuRuler, LuWeight } from "react-icons/lu"
import QAItemCard from "./QAItemCard"

const PackageDetails = () => {
  const { order } = useOrder()
  const { updateItemQAStatus: updateQAStatus } = useOrderActions()
  const { setView, clearSelectedPackage } = useQAActions()
  const selectedPackageId = useQA((state) => state.selectedPackageId)

  const pkg = order?.packages.find(p => p.id === selectedPackageId)
  const packageItems = order?.items.filter(item => item.packageId === selectedPackageId) ?? []

  const handleToggle = async (item: Order['items'][number]) => {
    const next = !item.isQAVerified
    updateQAStatus(item.id, next)
    await updateItemQAStatus(item.id, next)
  }

  if (!pkg) return null

  const { box } = pkg
  const dimensions = `${box.length} × ${box.width} × ${box.height}`

  return (
    <div className="flex flex-col gap-6">

      <div>
        <button onClick={() => {
          setView('display');
          clearSelectedPackage();
        }} className="btn btn-xl btn-secondary">Back to All Packages</button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-md border-2 border-transparent">
          <div className="card-body gap-3 py-4">
            <div className="flex items-center gap-2">
              <LuPackage className="size-6 text-primary" />
              <span className="font-bold text-2xl text-base-content">{box.name}</span>
            </div>
            <div className="flex items-center gap-4 text-lg text-base-content/60">
              <div className="flex items-center gap-1">
                <LuRuler className="size-5" />
                <span>{dimensions}</span>
              </div>
              {box.maxWeight != null && (
                <div className="flex items-center gap-1">
                  <LuWeight className="size-5" />
                  <span>{box.maxWeight} lbs max</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border-2 border-transparent">
          <div className="card-body gap-3 py-4">
            <div className="flex items-center gap-2">
              <LuWeight className="size-6 text-primary" />
              <span className="font-bold text-2xl text-base-content">Package Weight</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-base-content">
                {pkg.weight != null ? `${pkg.weight} lbs` : 'Not set'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="font-bold text-2xl text-base-content">
          Items ({packageItems.length})
        </div>
        {packageItems.length === 0 && (
          <div className="text-lg text-base-content/60">No items in this package.</div>
        )}
        {packageItems.map(item => (
          <QAItemCard
            key={item.id}
            item={item}
            completed={item.isQAVerified}
            onToggle={handleToggle}
          />
        ))}
      </div>

    </div>
  )
}

export default PackageDetails
