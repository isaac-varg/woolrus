import { GraphQLClient } from "graphql-request"

const endpoint = process.env.NEXT_PUBLIC_WOO_GRAPHQL_URL!;

export const woo = new GraphQLClient(endpoint);
