import { IsArray, IsBoolean, IsIn, Length } from 'class-validator';
import { IsCompareDateInput } from '../../decorators/is.compare.date.input';
import { Gender, IUserFilterModel } from '../../models/user.model';
import { CompareDateInput, CompareNullableDateInput } from '../compare';
import { BaseArg } from './base.arg';
import { RoleQuery } from './role.query';

export class FindArgs extends BaseArg implements IUserFilterModel {
    /**
     * Get users base on account status active
     */
    @IsBoolean()
    public active?: boolean;

    /**
     * Get users base on gender
     */
    @IsIn([Gender.MALE, Gender.FEMALE, null])
    public gender?: Gender | null;

    /**
     * Get users base on role
     */
    public role?: RoleQuery;

    /**
     * Get users base on account deleted
     */
    @IsBoolean()
    public deleted?: boolean;

    /**
     * Get users base on account deletion date
     */
    @IsCompareDateInput()
    public deletedAt?: CompareNullableDateInput;

    /**
     * Get users base on created date
     */
    @IsCompareDateInput()
    public createdAt?: CompareDateInput;

    /**
     * Get users base on updated date
     */
    @IsCompareDateInput()
    public updatedAt?: CompareDateInput;

    /**
     * Get users base on last login date
     */
    @IsCompareDateInput()
    public lastLogin?: CompareNullableDateInput;

    /**
     * Get users base on birthday
     */
    @IsCompareDateInput()
    public birthday?: CompareNullableDateInput;

    /**
     * Get users base on given groups
     */
    @IsArray()
    @Length(24, 24, {each: true})
    public groups?: string[];

    constructor(data: IUserFilterModel = {}) {
        super(data);
    }
}
