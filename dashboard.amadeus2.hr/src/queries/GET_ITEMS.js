import { gql } from 'apollo-boost';

export const GET_ITEMS = gql`
  query allItems {
    items {
      id
      name {
        hr
        en
      }
      price
      discountedPrice
      description {
        hr
        en
      }
      availability {
        hr
        en
      }
      slug
      quantity
      images {
        src
        index
      }
      type {
        hr
        en
      }
      brand
    }
  }
`;
