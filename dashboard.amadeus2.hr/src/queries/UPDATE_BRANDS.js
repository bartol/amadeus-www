import gql from 'graphql-tag';

export const UPDATE_BRANDS = gql`
  mutation($json: String!) {
    updateBrands(json: $json)
  }
`;
