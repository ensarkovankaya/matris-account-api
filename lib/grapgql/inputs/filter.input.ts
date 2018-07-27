import { IsArray, IsBoolean, Length, ValidateIf } from 'class-validator';
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
    @ValidateIf(((object, value) => value !== undefined))
    @IsBoolean()
    public active?: boolean;

    /**
     * Get users base on gender
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsGenderQuery()
    public gender?: GenderQuery;

    /**
     * Get users base on role
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsRoleQuery()
    public role?: RoleQuery;

    /**
     * Get users base on account deleted
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsBoolean()
    public deleted?: boolean;

    /**
     * Get users base on account deletion date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsCompareDateInput()
    public deletedAt?: CompareNullableDateInput;

    /**
     * Get users base on created date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsCompareDateInput()
    public createdAt?: CompareDateInput;

    /**
     * Get users base on updated date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsCompareDateInput()
    public updatedAt?: CompareDateInput;

    /**
     * Get users base on last login date
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsCompareDateInput()
    public lastLogin?: CompareNullableDateInput;

    /**
     * Get users base on birthday
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsCompareDateInput()
    public birthday?: CompareNullableDateInput;

    /**
     * Get users base on given groups
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsArray()
    @Length(24, 24, {each: true})
    public groups?: string[];

    constructor(data: IUserFilterModel) {
        super(data, ['active', 'gender', 'role', 'deleted', 'deletedAt', 'createdAt',
            'updatedAt', 'lastLogin', 'birthday', 'groups']);
    }
}
