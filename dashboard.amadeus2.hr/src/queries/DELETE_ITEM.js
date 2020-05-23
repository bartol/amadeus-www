import gql from 'graphql-tag';

export const DELETE_ITEM = gql`
  mutation($id: ID!) {
    delete(id: $id)
  }
`;
