import { gql } from '@apollo/client';

export const HTTP_REQUEST_LOG = gql`
{
  httpRequestLog {
    abnormal
    normal
  }
}
`;
