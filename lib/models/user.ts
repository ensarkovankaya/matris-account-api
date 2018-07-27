import {
    IsAlphanumeric,
    IsArray,
    IsBoolean,
    IsDate,
    IsEmail,
    IsIn, IsLowercase,
    IsString,
    Length, Matches,
    ValidateIf
} from 'class-validator';
import { UserFieldRequired } from '../error';
import { Validatable } from '../grapgql/validatable';
import { Gender } from './gender.model';
import { Role } from './role.model';
import { IUser, IUserModel, userFields } from './user.model';

export class UserSchema extends Validatable implements Partial<IUser> {
    @ValidateIf(((object, value) => value !== undefined))
    @Length(24, 24)
    public id?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @Length(4, 20, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @IsEmail()
    public email?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @IsString()
    @Length(2, 32, {message: 'InvalidLength'})
    @Matches(new RegExp('^[a-zA-Z ]+$'), 'g')
    public firstName?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @IsString()
    @Length(2, 32, {message: 'InvalidLength'})
    @Matches(new RegExp('^[a-zA-Z ]+$'), 'g')
    public lastName?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT])
    public role?: Role;

    @ValidateIf(((object, value) => value !== undefined))
    @IsIn([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN])
    public gender?: Gender;

    @ValidateIf(((object, value) => value !== undefined && value !== null))
    @IsDate()
    public birthday?: Date | null;

    @ValidateIf(((object, value) => value !== undefined))
    @IsBoolean()
    public active?: boolean;

    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public createdAt?: Date;

    @ValidateIf(((object, value) => value !== undefined))
    @IsDate()
    public updatedAt?: Date;

    @ValidateIf(((object, value) => value !== undefined && value !== null))
    @IsDate()
    public deletedAt?: Date | null;

    @ValidateIf(((object, value) => value !== undefined))
    @IsBoolean()
    public deleted?: boolean;

    @ValidateIf(((object, value) => value !== undefined && value !== null))
    @IsDate()
    public lastLogin?: Date | null;

    @ValidateIf(((object, value) => value !== undefined))
    @IsArray()
    @Length(24, 24, {message: 'InvalidIDLength', each: true})
    public groups?: string[];

    constructor(data: Partial<IUser>) {
        super(data, ['id', 'username', 'email', 'firstName', 'lastName', 'role', 'gender', 'birthday',
             'active', 'createdAt', 'updatedAt', 'deletedAt', 'deleted', 'lastLogin', 'groups']);
    }

    public toJSON(): Partial<IUserModel> {
        const obj: Partial<IUserModel> = {};
        Object.keys(this).forEach(field => {
            const value = this[field];
            if (value && value.toJSON) {
                obj[field] = value.toJSON();
            } else {
                obj[field] = value;
            }
        });
        return obj;
    }
}

/**
 * Transform api result to User object and validates result.
 * @param {Partial<IUserModel>} data: User data
 * @return {Promise<UserSchema>}
 */
export const User = async (data: Partial<IUserModel>): Promise<UserSchema> => {
    if (Object.keys(data).length === 0) {
        throw new UserFieldRequired();
    }
    const createData: Partial<IUser> = {};
    Object.keys(data).forEach(key => {
        if (userFields.find(field => field === key)) {
            if (key === '_id') {
                createData.id = data._id;
            } else if (key === 'birthday') {
                if (data.birthday) {
                    createData.birthday = new Date(data.birthday);
                } else {
                    createData.birthday = null;
                }
            } else if (key === 'createdAt' && data.createdAt) {
                createData.createdAt = new Date(data.createdAt);
            } else if (key === 'updatedAt' && data.updatedAt) {
                createData.updatedAt = new Date(data.updatedAt);
            } else if (key === 'deletedAt') {
                if (data.deletedAt) {
                    createData.deletedAt = new Date(data.deletedAt);
                } else {
                    createData.deletedAt = null;
                }
            } else if (key === 'lastLogin') {
                if (data.lastLogin) {
                    createData.lastLogin = new Date(data.lastLogin);
                } else {
                    createData.lastLogin = null;
                }
            } else {
                createData[key] = data[key];
            }
        }
    });
    const user = new UserSchema(createData);
    await user.validate();
    return user;
};
