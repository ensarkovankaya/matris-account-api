import { IsArray, IsBoolean, Length } from 'class-validator';
import { IsCompareDateInput } from '../../decorators/is.compare.date.input';
import { IsGenderQuery } from '../../decorators/is.gender.query';
import { IsRoleQuery } from '../../decorators/is.role.query';
import { IUserFilterModel } from '../../models/user.filter.model';
import { GenderQuery } from '../args/gender.query';
import { RoleQuery } from '../args/role.query';
import { CompareDateInput, CompareNullableDateInput } from '../compare';
import { Validatable } from '../validatable';

export class FilterInput extends Validatable implements IUserFilterModel {
    /**
     * Get users base on account status active
     */
    @IsBoolean()
    public active?: boolean;

    /**
     * Get users base on gender
     */
    @IsGenderQuery()
    public gender?: GenderQuery;

    /**
     * Get users base on role
     */
    @IsRoleQuery()
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
