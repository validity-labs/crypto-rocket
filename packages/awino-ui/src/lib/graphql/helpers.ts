import { request } from 'graphql-request';

export const fetcher = (query: string, variables: any) => request('https://api.spacex.land/graphql/', query, variables);
// export const fetcher = (query: string, variables: any) => request('/api/graphql', query, variables);

export interface GraphqlResponse<T> {
  results: T;
  count: number;
  next: string;
  previous: string;
}
