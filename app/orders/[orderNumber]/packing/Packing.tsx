'use client'

import { useOrder } from "@/store/orderSlice"
import Top from "../shared/Top"
import { useTranslations } from "next-intl"
import { TbUser } from "react-icons/tb"
import Image from "next/image"

const Packing = () => {
  const { order } = useOrder()
  const t = useTranslations('orderPacking')

  const pickers = order?.items
    .flatMap(i => i.pickedBy ? [i.pickedBy] : [])
    .filter((user, index, self) => self.findIndex(u => u.id === user.id) === index)

  return (
    <div className="flex flex-col gap-6">

      <Top />

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

    </div>
  )
}

export default Packing
