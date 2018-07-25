import { APIValidationError } from './error';
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

    public hasErrors(): boolean {
        return this.errors.length > 0;
    }

    public hasError(name: string, raise: boolean = false): boolean {
        const hasError = this.errors.filter(e => e.message === name).length > 0;
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
