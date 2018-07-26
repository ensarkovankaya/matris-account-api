import { Role } from '../../models/role.model';

export interface IRoleQueryModel {
    eq?: Role;
    in?: Role[];
}
