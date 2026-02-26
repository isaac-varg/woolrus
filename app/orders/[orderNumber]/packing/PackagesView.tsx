import { useOrder } from "@/store/orderSlice"
import PackageCard from "./PackageCard"
import { TbPlus } from "react-icons/tb"
import { usePackageActions } from "@/store/packageSlice"
import { useTranslations } from "next-intl"

const PackagesView = () => {
  const { order } = useOrder()
  const { setView } = usePackageActions()
  const t = useTranslations('orderPacking')

  const packages = order?.packages ?? []

  console.log(packages);

  const getItemsForPackage = (packageId: string) =>
    order?.items.filter(item => item.packageId === packageId) ?? []



  return (
    <div>
      {packages.length === 0 && (
        <div className="text-lg text-base-content/60">{t('noPackagesYet')}</div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {packages.map(pkg => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            items={getItemsForPackage(pkg.id)}
          />
        ))}


        <div
          onClick={() => setView('addPackage')}
          className="card bg-base-100 hover:cursor-pointer hover:bg-accent/50 shadow-md border-2 border-transparent"
        >
          <div className="card-body flex flex-row items-center gap-2">
            <TbPlus className="size-8 text-base-content" />
            <span className="text-2xl font-semibold text-base-content">{t('addPackage')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackagesView
