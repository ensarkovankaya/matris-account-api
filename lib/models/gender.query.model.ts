import { Gender } from './gender.model';

export interface IGenderQueryModel {
    eq?: Gender;
    in?: Gender[];
}
