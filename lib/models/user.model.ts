import { Gender } from './gender.model';
import { Role } from './role.model';

export interface IUserModel {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    gender: Gender;
    birthday: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
    lastLogin: string | null;
}

export interface IUser {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    gender: Gender;
    birthday: Date | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    deleted: boolean;
    lastLogin: Date | null;
}

export type UserField =
    '_id'
    | 'email'
    | 'username'
    | 'firstName'
    | 'lastName'
    | 'role'
    | 'gender'
    | 'birthday'
    | 'active'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'deleted'
    | 'lastLogin';

export const userFields: UserField[] = [
    '_id',
    'email',
    'username',
    'firstName',
    'lastName',
    'role',
    'gender',
    'birthday',
    'active',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'deleted',
    'lastLogin'
];
