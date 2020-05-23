import gql from 'graphql-tag';

export const ADD_ITEM = gql`
  mutation($input: NewItem!) {
    add(input: $input) {
      id
    }
  }
`;
