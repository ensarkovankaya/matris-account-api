import { GraphQLError } from "graphql-request/dist/src/types";
import { ValidationError } from "../../../node_modules/class-validator";

export interface IGraphQLError extends GraphQLError {
    validationErrors?: ValidationError[];
}
