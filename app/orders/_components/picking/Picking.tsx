import { getOrders } from "@/actions/orders/getOrders"
import Table from "./Table"
import { LuSearch } from "react-icons/lu"
import { getTranslations } from "next-intl/server"

const OrdersPicking = async () => {
  const orders = await getOrders("PICKING")
  const t = await getTranslations('orders')

  return (
    <div className="flex flex-col gap-6 py-8 px-12">

      <div className="flex flex-col gap-y-6">
        <div className="text-4xl text-base-content font-semibold">{t('picking')}</div>

        <div className="flex-1 relative">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 border border-zinc-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {orders.length === 0 && (
          <div className="flex items-center justify-center py-16 text-base-content/50">
            {t('noPicking')}
          </div>

        )}

        {/*  <div className="border-b border-primary" />*/}
      </div>

      {orders.length !== 0 && (
        <Table orders={orders} />
      )}
    </div>
  )
}

export default OrdersPicking
