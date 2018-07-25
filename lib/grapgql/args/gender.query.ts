import { IsIn, ValidateIf } from 'class-validator';
import { Gender } from '../../models/gender.model';
import { IGenderQueryModel } from '../../models/gender.query.model';
import { Validatable } from '../validatable';

export class GenderQuery extends Validatable implements IGenderQueryModel {
    /**
     * Get users role equal to given role
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsIn([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN], {message: 'Invalid'})
    public eq?: Gender;

    /**
     * Get users one of given role.
     */
    @ValidateIf(((object, value) => value !== undefined))
    @IsIn([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN], {message: 'Invalid', each: true})
    public in?: Gender[];

    constructor(data: { eq?: Gender, in?: Gender[] } = {}) {
        super(data);
    }
}
