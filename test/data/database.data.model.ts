import { Gender } from "../../lib/models/gender.model";
import { Role } from "../../lib/models/role.model";

export interface IDBUserModel {
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
    groups: string[];
}
