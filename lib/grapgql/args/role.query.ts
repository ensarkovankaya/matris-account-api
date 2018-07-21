import { IsIn } from 'class-validator';
import { Role } from '../../models/role.model';
import { Validatable } from '../validatable';

export class RoleQuery extends Validatable {
    /**
     * Get users role equal to given role
     */
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT])
    public eq?: Role;

    /**
     * Get users one of given role.
     */
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {each: true})
    public in?: Role[];

    constructor(data: { eq?: Role, in?: Role[] } = {}) {
        super(data);
    }
}
