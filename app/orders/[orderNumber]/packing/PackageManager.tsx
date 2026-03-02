import { usePackage, usePackageActions } from "@/store/packageSlice"
import PackagesView from "./PackagesView"
import PackageDetails from "./PackageDetails"
import PackageAdd from "./PackageAdd"
import { useTranslations } from "next-intl"
import { useOrder } from "@/store/orderSlice"
import { useEffect } from "react"

const PackageManager = () => {
  const { view } = usePackage()
  const { setView } = usePackageActions()
  const { order } = useOrder()
  const orderId = order?.id || null;
  const t = useTranslations('orderPacking')

  useEffect(() => {
    setView('display')

  }, [orderId, setView])


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
