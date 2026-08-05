import { GraphQLClient } from "graphql-request"

let client: GraphQLClient | null = null

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

export function getWooClient() {
  if (client) return client

  const endpoint = requireEnv("WOO_GRAPHQL_URL")
  const key = requireEnv("WP_GRAPHQL_KEY")
  const secret = requireEnv("WP_GRAPHQL_SECRET")

  client = new GraphQLClient(endpoint, {
    headers: {
      'Authorization': `Basic ${btoa(`${key}:${secret}`)}`,
    }
  })

  return client
}
