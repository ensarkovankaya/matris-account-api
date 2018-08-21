import { ICompareDateInput, ICompareNullableDateInput } from '../grapgql/models/compare.model';
import { IGenderQueryModel } from '../grapgql/models/gender.query.model';
import { IRoleQueryModel } from '../grapgql/models/role.query.model';

export interface IUserFilterModel {
    active?: boolean;
    role?: IRoleQueryModel;
    gender?: IGenderQueryModel;
    birthday?: ICompareNullableDateInput;
    deleted?: boolean;
    deletedAt?: ICompareNullableDateInput;
    createdAt?: ICompareDateInput;
    updatedAt?: ICompareDateInput;
    lastLogin?: ICompareNullableDateInput;
}
