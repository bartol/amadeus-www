import gql from 'graphql-tag';

export const UPDATE_FEATURED = gql`
  mutation($json: String!) {
    updateFeaturedItems(json: $json)
  }
`;
