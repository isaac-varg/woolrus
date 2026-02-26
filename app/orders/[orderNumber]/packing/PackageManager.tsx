import { usePackage } from "@/store/packageSlice"
import PackagesView from "./PackagesView"
import PackageDetails from "./PackageDetails"
import PackageAdd from "./PackageAdd"
import { useTranslations } from "next-intl"

const PackageManager = () => {
  const { view } = usePackage()
  const t = useTranslations('orderPacking')

  return (
    <div className="flex flex-col gap-6">

      <div className="font-bold text-3xl text-base-content">{t('packages')}</div>


      {view === 'display' && <PackagesView />}

      {view === 'packageDetails' && <PackageDetails />}

      {view === 'addPackage' && <PackageAdd />}


    </div>
  )
}

export default PackageManager
