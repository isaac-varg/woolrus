import { useState } from "react"
import { useOrder, useOrderActions } from "@/store/orderSlice"
import { usePackage, usePackageActions } from "@/store/packageSlice"
import { assignItemToPackage } from "@/actions/orders/assignItemToPackage"
import { removeItemFromPackage } from "@/actions/orders/removeItemFromPackage"
import { updatePackageWeight } from "@/actions/orders/updatePackageWeight"
import { Order } from "@/actions/orders/getOrder"
import { LuPackage, LuRuler, LuWeight } from "react-icons/lu"
import PackageItemCard from "./PackageItemCard"
import AddNoteDialog from "@/components/notes/AddNoteDialog"

const PackageDetails = () => {
  const { order } = useOrder()
  const { syncItems, setOrder } = useOrderActions()
  const { setView, clearSelectedPackage } = usePackageActions()
  const selectedPackageId = usePackage((state) => state.selectedPackageId)

  const pkg = order?.packages.find(p => p.id === selectedPackageId)
  const packageItems = order?.items.filter(item => item.packageId === selectedPackageId) ?? []
  const unassignedItems = order?.items.filter(item => !item.packageId) ?? []

  const [weight, setWeight] = useState<string>(pkg?.weight?.toString() ?? '')

  const handleAssign = async (item: Order['items'][number]) => {
    if (!selectedPackageId) return
    const items = await assignItemToPackage(item.id, selectedPackageId)
    syncItems(items)
  }

  const handleRemove = async (item: Order['items'][number]) => {
    const items = await removeItemFromPackage(item.id)
    syncItems(items)
  }

  const handleWeightSave = async () => {
    if (!pkg || !order) return
    const parsed = weight === '' ? null : parseFloat(weight)
    if (parsed !== null && isNaN(parsed)) return
    await updatePackageWeight(pkg.id, parsed)
    setOrder({
      ...order,
      packages: order.packages.map(p =>
        p.id === pkg.id ? { ...p, weight: parsed } : p
      ),
    })
  }

  if (!pkg) return null

  const { box } = pkg
  const dimensions = `${box.length} × ${box.width} × ${box.height}`

  return (
    <div className="flex flex-col gap-6">

      <div className="flex justify-between items-center">
        <button onClick={() => {
          setView('display');
          clearSelectedPackage();
        }} className="btn btn-xl btn-secondary">Back to All Packages</button>
        {selectedPackageId && <AddNoteDialog packageId={selectedPackageId} />}
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
              <input
                type="number"
                step="0.01"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onBlur={handleWeightSave}
                placeholder="Enter weight"
                className="input input-bordered input-lg w-full"
              />
              <span className="text-lg text-base-content/60">lbs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <div className="font-bold text-2xl text-base-content">
            Package Items ({packageItems.length})
          </div>
          {packageItems.length === 0 && (
            <div className="text-lg text-base-content/60">No items assigned yet.</div>
          )}
          {packageItems.map(item => (
            <PackageItemCard key={item.id} item={item} onClick={handleRemove} />
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
            <PackageItemCard key={item.id} item={item} onClick={handleAssign} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default PackageDetails
