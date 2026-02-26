import { Order } from "@/actions/orders/getOrder"
import { usePackageActions } from "@/store/packageSlice"
import { LuBox, LuPackage, LuRuler, LuWeight } from "react-icons/lu"
import NoteIndicator from "@/components/notes/NoteIndicator"
import { useTranslations } from "next-intl"

type Package = Order['packages'][number]

type Props = {
  pkg: Package
  items: Order['items']
}

const PackageCard = ({ pkg, items }: Props) => {
  const { box } = pkg
  const dimensions = `${box.length} × ${box.width} × ${box.height}`
  const { openPackageDetails } = usePackageActions()
  const t = useTranslations('orderPacking')
  console.log(items)

  return (
    <div
      onClick={() => openPackageDetails(pkg.id)}
      className="card bg-base-100 shadow-md border-2 border-transparent cursor-pointer hover:bg-accent/50"
    >
      <div className="card-body gap-3 py-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuPackage className="size-6 text-primary" />
            <span className="font-bold text-2xl text-base-content">{box.name}</span>
          </div>
          <NoteIndicator count={pkg.notes?.length ?? 0} />
        </div>

        <div className="flex items-center gap-4 text-lg text-base-content/60">
          <div className="flex items-center gap-1">
            <LuRuler className="size-5" />
            <span>{dimensions}</span>
          </div>
          {pkg.weight != null && (
            <div className="flex items-center gap-1">
              <LuWeight className="size-5" />
              <span>{pkg.weight} {t('lbs')}</span>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-1 mt-1">
            <div className="text-base text-base-content/60">{t('itemCount', { count: items.length })}</div>
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between text-lg">
                <span className="text-base-content">{item.name}</span>
                <span className="text-base-content/60">×{item.quantity}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default PackageCard
