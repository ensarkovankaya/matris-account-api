import { Gender } from './gender.model';
import { Role } from './role.model';

export interface IUserModel {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    gender: Gender | null;
    birthday: Date | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    deleted: boolean;
    lastLogin: Date | null;
    groups: string[];
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
    | 'lastLogin'
    | 'groups';

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
    'lastLogin',
    'groups'
];
