import gql from 'graphql-tag';

export const UPDATE_TYPES = gql`
  mutation($json: String!) {
    updateTypes(json: $json)
  }
`;
