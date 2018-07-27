import { GraphQLError as IGraphQLError } from 'graphql-request/dist/src/types';
import { ArgumentValidationError } from './grapgql/validatable';

export class GraphQLError extends Error implements IGraphQLError {
    public message: string;
    public locations: Array<{
        line: number;
        column: number;
    }>;
    public path: string[];

    constructor(error: IGraphQLError) {
        super();
        this.message = error.message;
        this.locations = error.locations;
        this.path = error.path;
    }
}

export class APIError extends Error {

    public name = 'APIError';
    public errors: IGraphQLError[];

    constructor(errors: IGraphQLError[]) {
        super();
        this.errors = errors;
    }

    public hasError(name: string): boolean {
        return !!this.errors.find(e => e.message === name);
    }
}

export class ArgumentRequired extends Error {
    public name = 'ArgumentRequired';

    constructor(args: string | string[]) {
        super();
        if (Array.isArray(args)) {
            this.message = `One of argument '${args.join(', ')}' required.`;
        } else {
            this.message = `Argument '${args}' required.`;
        }
    }

}

export class UserFieldRequired extends Error {
    public name = 'UserFieldRequired';

    constructor(fields?: string | string[]) {
        super();
        if (!fields) {
            this.message = 'At least one user field required';
        } else if (Array.isArray(fields)) {
            this.message = `One of fields '${fields.join(', ')}' required.`;
        } else {
            this.message = `Field '${fields}' required.`;
        }
    }
}

export class UserInvalid extends Error {
    public name = 'UserInvalid';

    constructor(public error: ArgumentValidationError) {
        super();
    }
}

export class NotUserField extends Error {
    public name = 'NotUserField';

    constructor(field?: string) {
        super(field ? `Field '${field}' not a known user field.` : `Given field not a known user field.`);
    }
}

export class UnexpectedResponse extends Error {
    public name = 'UnexpectedResponse';

    constructor() {
        super('API returned an unexpected response.');
    }
}
