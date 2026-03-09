import { getOrdersWithUnresolvedVoids } from "@/actions/orders/getOrdersWithUnresolvedVoids"
import VoidsList from "./_components/VoidsList"
import { getTranslations } from "next-intl/server"

const VoidsPage = async () => {
  const orders = await getOrdersWithUnresolvedVoids()
  const t = await getTranslations('void')

  return (
    <div className="flex flex-col gap-6 py-8 px-12">
      <div className="text-4xl text-base-content font-semibold">{t('unresolvedVoids')}</div>

      {orders.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-base-content/50">
          {t('noUnresolvedVoids')}
        </div>
      ) : (
        <VoidsList orders={orders} />
      )}
    </div>
  )
}

export default VoidsPage
