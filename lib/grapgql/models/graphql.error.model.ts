import { ValidationError } from "class-validator";
import { GraphQLError } from "graphql-request/dist/src/types";

export interface IGraphQLError extends GraphQLError {
    validationErrors?: ValidationError[];
}
