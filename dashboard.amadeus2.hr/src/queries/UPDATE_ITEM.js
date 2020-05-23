import gql from 'graphql-tag';

export const UPDATE_ITEM = gql`
  mutation($input: UpdatedItem!) {
    update(input: $input) {
      id
    }
  }
`;
