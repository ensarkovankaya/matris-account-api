import { GraphQLError } from 'graphql-request/dist/src/types';

export interface IAPIResponse<T> {
    errors: GraphQLError[];
    status: number;
    data?: T;
}
