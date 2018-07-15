import { GraphQLError } from 'graphql-request/dist/src/types';
import { APIValidationError } from './error';
import { IAPIResponse } from './models/response.model';

export class APIResponse<T> implements IAPIResponse<T> {
    public errors: GraphQLError[];
    public status: number;
    public data: T;

    constructor(status: number, data: T, errors: GraphQLError[] = []) {
        this.status = status;
        this.errors = errors || [];
        this.data = data;
    }

    public hasErrors(): boolean {
        return this.errors ? this.errors.length > 0 : false;
    }

    public hasError(name: string, raise: boolean = false): boolean {
        const hasError = this.errors ? this.errors.filter(e => e.message === name).length > 0 : false;
        if (hasError && raise) {
            throw new APIValidationError(this.errors);
        }
        return hasError;
    }

    public raise() {
        if (this.hasErrors()) {
            throw new APIValidationError(this.errors);
        }
    }
}
