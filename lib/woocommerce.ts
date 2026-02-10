import { GraphQLClient } from "graphql-request"

const endpoint = process.env.NEXT_PUBLIC_WOO_GRAPHQL_URL!;
const key = process.env.WP_GRAPHQL_KEY!;
const secret = process.env.WP_GRAPHQL_SECRET!;

export const woo = new GraphQLClient(endpoint, {
  headers: {
    'Authorization': `Basic ${btoa(`${key}:${secret}`)}`,
  }
});
