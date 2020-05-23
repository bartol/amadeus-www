import gql from 'graphql-tag';

export const UPLOAD_BANNER = gql`
  mutation($base64: String!, $platform: String!, $link: MultiLangStringInput!) {
    uploadBanner(base64: $base64, platform: $platform, link: $link)
  }
`;
