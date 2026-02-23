import { useOrder } from "@/store/orderSlice"
import PackageCard from "./PackageCard"

const PackagesView = () => {
  const { order } = useOrder()

  const packages = order?.packages ?? []

  const getItemsForPackage = (packageId: string) =>
    order?.items.filter(item => item.packageId === packageId) ?? []

  return (
    <div>
      {packages.length === 0 && (
        <div className="text-lg text-base-content/60">No packages.</div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {packages.map(pkg => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            items={getItemsForPackage(pkg.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default PackagesView
