import { Gender } from './gender.model';
import { Role } from './role.model';

export interface ICreateInputModel {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    password: string;
    username?: string;
    active?: boolean;
    gender?: Gender;
    birthday?: Date | string;
    groups?: string[];
}
