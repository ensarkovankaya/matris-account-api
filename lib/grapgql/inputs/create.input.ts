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
import { ICreateInputModel } from '../models/create.input.model';
import { Validatable } from '../validatable';

export class CreateInput extends Validatable {

    @IsEmail({}, {message: 'InvalidEmail'})
    public email: string | undefined;

    @Matches(new RegExp('^[a-zA-Z ]+$'), {message: 'InvalidFirstName'})
    @Length(2, 32, {message: 'InvalidLength'})
    public firstName: string | undefined;

    @Matches(new RegExp('^[a-zA-Z ]+$'), {message: 'InvalidLastName'})
    @Length(2, 32, {message: 'InvalidLength'})
    public lastName: string | undefined;

    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {message: 'Invalid'})
    public role: Role | undefined;

    @Length(8, 32, {message: 'InvalidLength'})
    public password: string | undefined;

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
    @IsArray()
    @Length(24, 24, {message: 'InvalidIDLength', each: true})
    public groups?: string[];

    constructor(data: ICreateInputModel) {
        super(data, ['email', 'firstName', 'lastName', 'role',
            'password', 'username', 'active', 'gender', 'birthday', 'groups']);
    }
}
