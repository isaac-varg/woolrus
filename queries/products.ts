import { gql } from 'graphql-request';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products(first: 10) {
      nodes {
        id
        name
        sku
        ... on SimpleProduct {
          price
          stockQuantity
        }
      }
    }
  }
`;
