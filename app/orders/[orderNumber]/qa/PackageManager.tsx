import { useQA } from "@/store/qaSlice"
import PackagesView from "./PackagesView"
import PackageDetails from "./PackageDetails"

const PackageManager = () => {
  const { view } = useQA()

  return (
    <div className="flex flex-col gap-6">

      <div className="font-bold text-3xl text-base-content">Packages</div>

      {view === 'display' && <PackagesView />}

      {view === 'packageDetails' && <PackageDetails />}

    </div>
  )
}

export default PackageManager
