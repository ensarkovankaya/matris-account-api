import { APIError, GraphQLError } from './error';
import { IGraphQLError } from './grapgql/models/graphql.error.model';
import { IAPIResponse } from './models/response.model';

export class APIResponse<T> implements IAPIResponse<T> {
    public errors: IGraphQLError[];
    public status: number;
    public data: T;

    constructor(status: number, data: T, errors: IGraphQLError[] = []) {
        this.status = status;
        this.errors = errors || [];
        this.data = data;
    }

    public hasErrors(raise: boolean = false): boolean {
        const has = this.errors.length > 0;
        if (raise) {
            throw new APIError(this.errors);
        }
        return has;
    }

    public hasError(message: string, raise: boolean = false): boolean {
        const error = this.errors.find(e => e.message === message);
        if (error && raise) {
            throw new GraphQLError(error);
        }
        return !!error;
    }
}
