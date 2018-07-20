import { ICompareModel, INullableCompareModel } from './compare.model';
import { IGenderQueryModel } from './gender.query.model';
import { IRoleQueryModel } from './role.query.model';

export interface IUserFilterModel {
    active?: boolean;
    role?: IRoleQueryModel;
    gender?: IGenderQueryModel;
    birthday?: INullableCompareModel;
    deleted?: boolean;
    deletedAt?: INullableCompareModel;
    createdAt?: ICompareModel;
    updatedAt?: ICompareModel;
    lastLogin?: INullableCompareModel;
    groups?: string[];
}
