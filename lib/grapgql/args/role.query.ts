import { IsIn, ValidateIf } from 'class-validator';
import { Role } from '../../models/role.model';
import { Validatable } from '../validatable';

export class RoleQuery extends Validatable {
    /**
     * Get users role equal to given role
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT])
    public eq?: Role;

    /**
     * Get users one of given role.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {each: true})
    public in?: Role[];

    constructor(data: { eq?: Role, in?: Role[] } = {}) {
        super(data);
    }
}
