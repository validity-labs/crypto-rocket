import { request } from 'graphql-request';

export type SubgraphKey = 'exchange' | 'masterchef';
export type SubgraphFetcher = (query: string, variables: any) => Promise<any>;

type ResponseNormalizer = (data: any) => any;

export const createFetcher =
  (subgraphKey: SubgraphKey, normalize?: ResponseNormalizer) =>
  async <T>(query: string, variables: any) => {
    const data = await request(`/api/subgraph/${subgraphKey}`, query, variables);
    if (typeof normalize === 'function') {
      normalize(data);
    }
    // console.info('query', subgraphKey, variables, data?.items || []);
    return data?.items || [];
  };
// export const fetcher = (query: string, variables: any) => request('/api/graphql', query, variables);

export interface GraphqlResponse<T> {
  results: T;
  count: number;
  next: string;
  previous: string;
}
