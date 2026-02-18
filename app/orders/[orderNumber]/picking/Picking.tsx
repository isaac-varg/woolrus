
import { getTranslations } from "next-intl/server"
import Top from "../shared/Top"
import ItemsGrid from "./ItemsGrid"

const Picking = async () => {

  const t = await getTranslations('orderPending')

  return (
    <div className="flex flex-col gap-6">
      <Top />

      <ItemsGrid />

    </div>




  )
}

export default Picking
