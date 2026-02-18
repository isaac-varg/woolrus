import { getTranslations } from "next-intl/server"

const Picking = async () => {

  const t = await getTranslations('orderPending')

  return (
    <div>
      <div className="text-4xl text-base-content font-semibold">{t('title')}</div>
    </div>




  )
}

export default Picking
