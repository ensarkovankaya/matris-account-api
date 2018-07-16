import { IsDate, IsNumber } from 'class-validator';
import { BaseArg } from './args/base.arg';
import { ICompareDateInput, ICompareNullableDateInput, ICompareNumberInput } from './models/compare.model';

/**
 * Compare integer information for given field.
 * You can combine two field such as "gt" and "lt" to make range operations.
 */
export class CompareNumberInput extends BaseArg implements ICompareNumberInput {
    /**
     * Equal to number.
     */
    @IsNumber()
    public eq?: number;

    /**
     * Greater than number.
     */
    @IsNumber()
    public gt?: number;

    /**
     * Greater or equal than number.
     */
    @IsNumber()
    public gte?: number;

    /**
     * Less than number.
     */
    @IsNumber()
    public lt?: number;

    /**
     * Less than equal to number.
     */
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
export class CompareDateInput extends BaseArg implements ICompareDateInput {
    /**
     * Equal to date
     */
    @IsDate()
    public eq?: Date;

    /**
     * After than date
     */
    @IsDate()
    public gt?: Date;

    /**
     * After or equal to date
     */
    @IsDate()
    public gte?: Date;

    /**
     * Before than date
     */
    @IsDate()
    public lt?: Date;

    /**
     * Before or equal to date.
     */
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
export class CompareNullableDateInput extends BaseArg implements ICompareNullableDateInput {
    /**
     * Equal to date
     */
    @IsDate()
    public eq?: Date | null;

    /**
     * After than date
     */
    @IsDate()
    public gt?: Date;

    /**
     * After or equal to date
     */
    @IsDate()
    public gte?: Date;

    /**
     * Before than date
     */
    @IsDate()
    public lt?: Date;

    /**
     * Before or equal to date.
     */
    @IsDate()
    public lte?: Date;

    constructor(data: ICompareDateInput = {}) {
        super(data);
    }
}
