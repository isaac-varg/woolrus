import { useOrder, useOrderActions } from "@/store/orderSlice"
import { usePackage, usePackageActions } from "@/store/packageSlice"
import { assignItemToPackage } from "@/actions/orders/assignItemToPackage"
import { removeItemFromPackage } from "@/actions/orders/removeItemFromPackage"
import { Order } from "@/actions/orders/getOrder"
import { LuPackage, LuRuler, LuWeight } from "react-icons/lu"
import PackageItemCard from "./PackageItemCard"

const PackageDetails = () => {
  const { order } = useOrder()
  const { assignItemToPackage: assignItem, removeItemFromPackage: removeItem } = useOrderActions()
  const { setView, clearSelectedPackage } = usePackageActions()
  const selectedPackageId = usePackage((state) => state.selectedPackageId)

  const pkg = order?.packages.find(p => p.id === selectedPackageId)
  const packageItems = order?.items.filter(item => item.packageId === selectedPackageId) ?? []
  const unassignedItems = order?.items.filter(item => !item.packageId) ?? []

  const handleAssign = async (item: Order['items'][number]) => {
    if (!selectedPackageId) return
    assignItem(item.id, selectedPackageId)
    await assignItemToPackage(item.id, selectedPackageId)
  }

  const handleRemove = async (item: Order['items'][number]) => {
    removeItem(item.id)
    await removeItemFromPackage(item.id)
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
            {pkg.weight != null && (
              <div className="flex items-center gap-1">
                <LuWeight className="size-5" />
                <span>{pkg.weight} lbs</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="font-bold text-2xl text-base-content">
          Package Items ({packageItems.length})
        </div>
        {packageItems.length === 0 && (
          <div className="text-lg text-base-content/60">No items assigned yet.</div>
        )}
        {packageItems.map(item => (
          <PackageItemCard key={item.id} item={item} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="font-bold text-2xl text-base-content">
          Unassigned Items ({unassignedItems.length})
        </div>
        {unassignedItems.length === 0 && (
          <div className="text-lg text-base-content/60">All items have been assigned.</div>
        )}
        {unassignedItems.map(item => (
          <PackageItemCard key={item.id} item={item} />
        ))}
      </div>

    </div>
  )
}

export default PackageDetails
