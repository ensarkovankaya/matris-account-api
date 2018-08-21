import {
    IsAlphanumeric,
    IsArray,
    IsBoolean,
    IsEmail,
    IsIn,
    IsLowercase,
    Length,
    Matches,
    ValidateIf
} from 'class-validator';
import { IsDateLike, IsInDateRange } from '../../decorators/date';
import { Gender } from '../../models/gender.model';
import { Role } from '../../models/role.model';
import { IUpdateInputModel } from '../models/update.input.model';
import { Validatable } from '../validatable';

export class UpdateInput extends Validatable {

    @ValidateIf(((object, value) => value !== undefined))
    @IsEmail({}, {message: 'InvalidEmail'})
    public email?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @Matches(new RegExp('^[a-zA-Z ]*$'), {message: 'InvalidFirstName'})
    @Length(0, 32, {message: 'InvalidLength'})
    public firstName?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @Matches(new RegExp('^[a-zA-Z ]*$'), {message: 'InvalidLastName'})
    @Length(0, 32, {message: 'InvalidLength'})
    public lastName?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {message: 'Invalid'})
    public role?: Role;

    @ValidateIf(((object, value) => value !== undefined))
    @Length(8, 32, {message: 'InvalidLength'})
    public password?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @Length(4, 32, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @IsBoolean()
    public active?: boolean;

    @ValidateIf(((object, value) => value !== undefined))
    @IsIn([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN], {message: 'InvalidGender'})
    public gender?: Gender;

    @ValidateIf(((object, value) => value !== undefined))
    @IsDateLike(true)
    @IsInDateRange(new Date(1950, 1, 1), new Date(2000, 12, 31))
    public birthday?: Date | string | null;

    @ValidateIf(((object, value) => value !== undefined))
    @IsBoolean()
    public updateLastLogin?: boolean;

    constructor(data: IUpdateInputModel) {
        super(data, ['email', 'firstName', 'lastName', 'role', 'updateLastLogin',
            'password', 'username', 'active', 'gender', 'birthday']);
    }
}
