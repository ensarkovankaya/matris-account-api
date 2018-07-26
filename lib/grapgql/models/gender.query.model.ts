import { Gender } from '../../models/gender.model';

export interface IGenderQueryModel {
    eq?: Gender;
    in?: Gender[];
}
