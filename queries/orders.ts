import { gql } from 'graphql-request';
export const GET_PROCESSING_ORDERS = gql`
  query GetProcessingOrders($after: String) {
    orders(where: { statuses: PROCESSING }, first: 25, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        orderNumber
        status
        date
        total
        paymentMethod
        customerNote
        billing {
          firstName
          lastName
          email
          phone
          address1
          address2
          city
          state
          postcode
          country
        }
        shipping {
          firstName
          lastName
          address1
          address2
          city
          state
          postcode
          country
        }
        lineItems {
          nodes {
            databaseId
            quantity
            total
            product {
              node {
                databaseId
                name
                sku
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
                }
              }
            }
            variation {
              node {
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
    }
  }
`;
