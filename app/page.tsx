import { woo } from "@/lib/woocommerce";
import { GET_PRODUCTS } from "@/queries/products";

export default async function Home() {
  const data = await woo.request(GET_PRODUCTS);

  return (
    <div>

      <pre>{JSON.stringify(data, null, 2)}</pre>
      hey
    </div>
  );
}
