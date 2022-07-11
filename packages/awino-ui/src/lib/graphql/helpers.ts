import { request } from 'graphql-request';

type SUBGRAPH_KEY = 'exchange' | 'masterchef';
type ResponseNormalaizer = (data: any) => any;

export const createFetcher =
  (subgraphKey: SUBGRAPH_KEY, normalize?: ResponseNormalaizer) => async (query: string, variables: any) => {
    // console.log(query, variables);
    const data = await request(`/api/subgraph/${subgraphKey}`, query, variables);
    if (typeof normalize === 'function') {
      normalize(data);
    }

    return data;
  };
// export const fetcher = (query: string, variables: any) => request('/api/graphql', query, variables);

export interface GraphqlResponse<T> {
  results: T;
  count: number;
  next: string;
  previous: string;
}
