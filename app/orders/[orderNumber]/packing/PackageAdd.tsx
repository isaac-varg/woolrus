import { createPackage } from "@/actions/orders/createPackage";
import { useData } from "@/store/dataSlice";
import { useOrder, useOrderActions } from "@/store/orderSlice";
import { usePackageActions } from "@/store/packageSlice";
import { LuRuler, LuWeight } from "react-icons/lu";

const PackageAdd = () => {

  const { setView, clearSelectedPackage, openPackageDetails } = usePackageActions()
  const { setOrder } = useOrderActions()
  const { order } = useOrder()
  const { boxes } = useData()

  const handleAddPackage = async (boxId: string) => {
    if (!order) return
    const updatedOrder = await createPackage(order.id, boxId)
    setOrder(updatedOrder)
    const newPackage = updatedOrder.packages[updatedOrder.packages.length - 1]
    openPackageDetails(newPackage.id)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <button onClick={() => {
          setView('display');
          clearSelectedPackage();
        }} className="btn btn-xl btn-secondary">Cancel</button>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {boxes.map(b => {
          return (
            <button
              key={b.id}
              onClick={() => handleAddPackage(b.id)}
              className="btn btn-outline btn-xl min-h-36 flex flex-col gap-2"
            >
              <div className="text-base-content text-2xl font-bold">
                {b.name}
              </div>
              <div className="text-base-content/60 flex gap-2 items-center text-xl font-semibold">
                <LuRuler className="size-6" />
                {`${b.length} x ${b.width} x ${b.height}`}
              </div>

              <div className="text-base-content/60 flex gap-2 items-center text-xl font-semibold">
                <LuWeight className="size-6" />
                {`${b.maxWeight} max`}
              </div>

            </button>
          )
        })}

      </div>

    </div>
  )
}

export default PackageAdd
