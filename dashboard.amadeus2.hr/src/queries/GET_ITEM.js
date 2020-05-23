import { gql } from 'apollo-boost';

export const GET_ITEM = gql`
  query oneItem($id: ID!) {
    item(id: $id) {
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
