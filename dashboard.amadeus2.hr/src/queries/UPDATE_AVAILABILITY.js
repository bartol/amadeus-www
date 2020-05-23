import gql from 'graphql-tag';

export const UPDATE_AVAILABILITY = gql`
  mutation($json: String!) {
    updateAvailability(json: $json)
  }
`;
