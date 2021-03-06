import { Gender } from '../../models/gender.model';
import { Role } from '../../models/role.model';

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
}
