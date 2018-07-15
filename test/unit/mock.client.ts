import { ClientError, GraphQLClient } from 'graphql-request';
import { Options, Variables } from 'graphql-request/dist/src/types';

/**
 * Mocks GraphQLClient
 */
export class MockGraphQLClient implements Partial<GraphQLClient> {
    public query?: string;
    public variables?: Variables;

    constructor(private url: string, private options: Options, private data?: any, private err?: ClientError) {
    }

    public async request<T extends any>(query: string, variables?: Variables): Promise<T> {
        this.query = query;
        this.variables = variables;
        if (this.err) {
            throw this.err;
        }
        return this.data;
    }
}
