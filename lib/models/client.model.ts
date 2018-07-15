import { Variables } from 'graphql-request/dist/src/types';

export interface IClientModel {
    request<T extends any>(query: string, variables?: Variables): Promise<T>;
}
