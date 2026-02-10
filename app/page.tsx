import { woo } from "@/lib/woocommerce";
import { GET_PROCESSING_ORDERS } from "@/queries/orders";
import { GET_PRODUCT_WITH_VARIATIONS } from "@/queries/products";


export default async function Home() {
  const another = await woo.request(GET_PROCESSING_ORDERS)

  return (
    <div>



      <pre>{JSON.stringify(another, null, 2)}</pre>
    </div>

  );
}
