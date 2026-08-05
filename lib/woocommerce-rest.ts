function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

export async function addWooOrderNote(wooId: number, note: string, customerNote = false) {
  const baseUrl = requireEnv('WOO_GRAPHQL_URL').replace('/graphql', '')
  const key = requireEnv('WP_GRAPHQL_KEY')
  const secret = requireEnv('WP_GRAPHQL_SECRET')

  const res = await fetch(`${baseUrl}/wp-json/wc/v3/orders/${wooId}/notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${key}:${secret}`)}`,
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
