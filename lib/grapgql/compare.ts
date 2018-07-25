import { IsDate, IsNumber, ValidateIf } from 'class-validator';
import { ICompareDateInput, ICompareNullableDateInput, ICompareNumberInput } from './models/compare.model';
import { Validatable } from './validatable';

/**
 * Compare integer information for given field.
 * You can combine two field such as "gt" and "lt" to make range operations.
 */
export class CompareNumberInput extends Validatable implements ICompareNumberInput {
    /**
     * Equal to number.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsNumber()
    public eq?: number;

    /**
     * Greater than number.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsNumber()
    public gt?: number;

    /**
     * Greater or equal than number.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsNumber()
    public gte?: number;

    /**
     * Less than number.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsNumber()
    public lt?: number;

    /**
     * Less than equal to number.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsNumber()
    public lte?: number;

    constructor(data: ICompareNumberInput = {}) {
        super(data);
    }
}

/**
 * Compare date information for given field.
 * You can combine two field such as "gt" and "lt" to make range operations.
 */
export class CompareDateInput extends Validatable implements ICompareDateInput {
    /**
     * Equal to date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public eq?: Date;

    /**
     * After than date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public gt?: Date;

    /**
     * After or equal to date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public gte?: Date;

    /**
     * Before than date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public lt?: Date;

    /**
     * Before or equal to date.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public lte?: Date;

    constructor(data: ICompareDateInput = {}) {
        super(data);
    }
}

/**
 * Compare date information for given field.
 * You can combine two field such as "gt" and "lt" to make range operations.
 */
export class CompareNullableDateInput extends Validatable implements ICompareNullableDateInput {
    /**
     * Equal to date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public eq?: Date | null;

    /**
     * After than date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public gt?: Date;

    /**
     * After or equal to date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public gte?: Date;

    /**
     * Before than date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public lt?: Date;

    /**
     * Before or equal to date.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public lte?: Date;

    constructor(data: ICompareDateInput = {}) {
        super(data);
    }
}
