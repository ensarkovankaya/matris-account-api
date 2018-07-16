import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { CompareDateInput } from '../grapgql/compare';

/**
 * Custom validator decorator for validating is input is type of DateCompareInput
 * See: https://github.com/typestack/class-validator#custom-validation-decorators
 *
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export const IsCompareDateInput = (validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "IsCompareDateInput",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate: async (value: any) => {
                    try {
                        await new CompareDateInput(value).validate();
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                defaultMessage: (validationArguments?: ValidationArguments) => {
                    return 'Invalid Compare Date Input';
                }
            }
        });
    };
};
