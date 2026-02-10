import { gql } from 'graphql-request';

export const GET_PRODUCT_WITH_VARIATIONS = gql`
  query GetProduct($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      databaseId
      name
      sku
      type
      image {
        sourceUrl
      }
      ... on SimpleProduct {
        price
        weight
        stockQuantity
      }
      ... on VariableProduct {
        price
        weight
        stockQuantity
        variations(first: 100) {
          nodes {
            databaseId
            name
            sku
            price
            weight
            stockQuantity
            image {
              sourceUrl
            }
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;
