import {
    IsAlphanumeric,
    IsArray,
    IsBoolean,
    IsDate,
    IsEmail,
    IsIn, IsLowercase,
    IsString,
    Length, Matches,
    ValidateIf,
    validateOrReject
} from 'class-validator';
import { UserFieldRequired, UserInvalid } from '../error';
import { Gender } from './gender.model';
import { Role } from './role.model';
import { IUserModel, userFields } from './user.model';

export class UserSchema implements Partial<IUserModel> {
    @Length(24, 24)
    public id?: string;

    @Length(4, 20, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @IsEmail()
    public email?: string;

    @IsString()
    @Length(2, 32, {message: 'InvalidLength'})
    @Matches(new RegExp('^[a-zA-Z ]+$'), 'g')
    public firstName?: string;

    @IsString()
    @Length(2, 32, {message: 'InvalidLength'})
    @Matches(new RegExp('^[a-zA-Z ]+$'), 'g')
    public lastName?: string;

    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT])
    public role?: Role;

    @IsIn([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN])
    public gender?: Gender;

    @ValidateIf(((object, value) => value !== null))
    @IsDate()
    public birthday?: Date | null;

    @IsBoolean()
    public active?: boolean;

    @IsDate()
    public createdAt?: Date;

    @IsDate()
    public updatedAt?: Date;

    @ValidateIf(((object, value) => value !== null))
    @IsDate()
    public deletedAt?: Date | null;

    @IsBoolean()
    public deleted?: boolean;

    @ValidateIf(((object, value) => value !== null))
    @IsDate()
    public lastLogin?: Date | null;

    @IsArray()
    @Length(24, 24, {message: 'InvalidIDLength', each: true})
    public groups?: string[];
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
    const user = new UserSchema();
    Object.keys(data).forEach(key => {
        if (userFields.find(field => field === key)) {
            if (key === '_id') {
                user.id = data._id;
            } else if (key === 'birthday') {
                user.birthday = data.birthday ? new Date(data.birthday) : data.birthday;
            } else if (key === 'createdAt' && data.createdAt) {
                user.createdAt = new Date(data.createdAt);
            } else if (key === 'updatedAt' && data.updatedAt) {
                user.updatedAt = new Date(data.updatedAt);
            } else if (key === 'deletedAt') {
                user.deletedAt = data.deletedAt ? new Date(data.deletedAt) : data.deletedAt;
            } else if (key === 'lastLogin') {
                user.lastLogin = data.lastLogin ? new Date(data.lastLogin) : data.lastLogin;
            } else {
                user[key] = data[key];
            }
        }
    });
    try {
        await validateOrReject(user, {skipMissingProperties: true});
    } catch (e) {
        throw new UserInvalid(e);
    }
    return user;
};
