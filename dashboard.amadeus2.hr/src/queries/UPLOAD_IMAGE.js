import gql from 'graphql-tag';

export const UPLOAD_IMAGE = gql`
  mutation($base64: String!, $name: String) {
    uploadImage(base64: $base64, name: $name)
  }
`;
