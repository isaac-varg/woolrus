import { getOrders } from "@/actions/orders/getOrders";
import { getTranslations } from "next-intl/server";
import AllOrdersTable from "./_components/AllOrdersTable";

const ViewAllOrders = async () => {
  const orders = await getOrders();
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-6 py-8 px-12">
      <div className="text-4xl text-base-content font-semibold">
        {t('menu.allOrders')}
      </div>
      <AllOrdersTable orders={orders} />
    </div>
  );
};

export default ViewAllOrders;
