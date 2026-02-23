import { TbUser } from "react-icons/tb"
import Image from "next/image"
import { useOrder } from "@/store/orderSlice"
import { useTranslations } from "next-intl"

const WorkflowHistory = () => {

  const { order } = useOrder()
  const t = useTranslations('orderQA')

  const pickers = order?.items
    .flatMap(i => i.pickedBy ? [i.pickedBy] : [])
    .filter((user, index, self) => self.findIndex(u => u.id === user.id) === index)

  const packedBy = order?.workflow?.packedBy

  return (
    <>
      <hr className="-mx-12 border-base-300" />

      <div className="flex items-center gap-3">
        <span className="text-base-content/60 text-lg">{t('pickedBy')}</span>
        {pickers?.map(picker => (
          <div key={picker.id} className="flex items-center gap-2">
            {picker.image ? (
              <Image
                src={picker.image}
                alt={picker.name ?? ''}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="size-8 rounded-full bg-base-300 flex items-center justify-center">
                <TbUser className="size-5 text-base-content/60" />
              </div>
            )}
            <span className="font-semibold text-base-content">{picker.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-base-content/60 text-lg">{t('packedBy')}</span>
        {packedBy && (
          <div className="flex items-center gap-2">
            {packedBy.image ? (
              <Image
                src={packedBy.image}
                alt={packedBy.name ?? ''}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="size-8 rounded-full bg-base-300 flex items-center justify-center">
                <TbUser className="size-5 text-base-content/60" />
              </div>
            )}
            <span className="font-semibold text-base-content">{packedBy.name}</span>
          </div>
        )}
      </div>

      <hr className="-mx-12 border-base-300" />

    </>
  )
}

export default WorkflowHistory
