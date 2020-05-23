import gql from 'graphql-tag';

export const DELETE_BANNER = gql`
  mutation($src: String!, $platform: String!) {
    deleteBanner(src: $src, platform: $platform)
  }
`;
