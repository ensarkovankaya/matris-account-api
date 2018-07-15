import { ValidationError } from 'class-validator/validation/ValidationError';
import { GraphQLError } from 'graphql-request/dist/src/types';

export class APIValidationError extends Error {

    public name = 'APIValidationError';
    public errors: GraphQLError[];

    constructor(errors: GraphQLError[]) {
        super();
        this.errors = errors;
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

    constructor(public errors: ValidationError[]) {
        super();
    }
}
