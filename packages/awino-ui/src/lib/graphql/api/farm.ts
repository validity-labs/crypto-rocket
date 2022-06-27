import { gql } from 'graphql-request';

import { GraphqlResponse } from '../helpers';

export const EXAMPLE_API_QUERY = gql`
  query {
    launchesPast(limit: 10) {
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
    }
  }
`;

export type ExampleAPIFetchResponse = GraphqlResponse<{
  rates: { awi: string };
}>;
