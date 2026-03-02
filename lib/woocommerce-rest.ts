const baseUrl = process.env.NEXT_PUBLIC_WOO_GRAPHQL_URL!.replace('/graphql', '')
const key = process.env.WP_GRAPHQL_KEY!
const secret = process.env.WP_GRAPHQL_SECRET!

const authHeader = `Basic ${btoa(`${key}:${secret}`)}`

export async function addWooOrderNote(wooId: number, note: string, customerNote = false) {
  const res = await fetch(`${baseUrl}/wp-json/wc/v3/orders/${wooId}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      note,
      customer_note: customerNote,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`WooCommerce REST error ${res.status}: ${body}`)
  }

  return res.json()
}
