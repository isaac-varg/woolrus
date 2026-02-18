'use client'
import { useOrder } from "@/store/orderSlice"
import Top from "../shared/Top"
import ItemCard from "./ItemCard"
import { TbUser, TbWorldPin } from "react-icons/tb"
import { useTranslations } from "next-intl"



const Pending = () => {

  const { order } = useOrder()
  const t = useTranslations('orderPending')

  return (

    <div className="flex flex-col gap-6">
      <Top />


      <button className="btn btn-xl btn-primary h-40">
        <span>{t("startButton")}</span>
      </button>



      <div className="grid grid-cols-2 gap-6">
        {order?.items.map(i => <ItemCard key={i.id} item={i} />)}
      </div>

    </div>

  )
}

export default Pending
