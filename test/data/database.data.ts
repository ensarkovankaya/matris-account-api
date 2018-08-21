import { ICompareNullableDateInput } from '../../lib/grapgql/models/compare.model';
import { IPaginateResult, IPaginationOptions } from '../../lib/grapgql/models/pagination.model';
import { User } from '../../lib/models/user';
import { IUserFilterModel } from '../../lib/models/user.filter.model';
import { IUserModel } from '../../lib/models/user.model';
import { DataSource } from './base';
import { IDBUserModel } from './database.data.model';

export class Database extends DataSource {

    private users: IDBUserModel[];

    constructor() {
        super();
        this.users = [];
    }

    public async load(data: IDBUserModel[], validate: boolean = true) {
        if (validate) {
            await Promise.all(data.map(u => User(u)));
        }
        try {
            this.users = data;
        } catch (e) {
            console.error('Load failed', e);
            throw e;
        }
    }
    /**
     * Returns random one valid user data
     * @param {IUserFilterModel} filter
     * @return {IUserModel}
     */
    public get(filter: IUserFilterModel = {}): IUserModel {
        const filtered = this._filter(this.users.slice(), filter);
        if (filtered.length === 0) {
            throw new Error('User not exists');
        }
        return this.choose<IUserModel>(this.shuffle<IUserModel>(filtered.slice()));
    }

    /**
     * Returns multiple valid user data
     * @param {number} limit
     * @param {IUserFilterModel} filter
     * @param {boolean} shuffle: Shuffle results
     * @return {IUserModel[]}
     */
    public multiple(limit: number, filter: IUserFilterModel = {}, shuffle: boolean = false): IUserModel[] {
        const filtered = this._filter(this.users.slice(), filter).slice(0, limit);
        return shuffle ? this.shuffle<IUserModel>(filtered) : filtered;
    }

    public paginate(data: IUserModel[], pagination: IPaginationOptions): IPaginateResult<IUserModel> {
        const page = pagination.page || 1;
        const limit = pagination.limit || 0;
        const offset = pagination.offset || 0;

        if (offset > data.length) {
            throw new Error('Offset out of data size.');
        }

        // Offset
        const offseted = data.slice(offset);

        const total = offseted.length;

        // Find pages
        let pages: number = 0;
        if (limit >= offseted.length) {
            pages = 1;
        } else {
            let count = 0;
            while (count < offseted.length) {
                count += limit;
                pages += 1;
            }
        }
        const start = limit * (page - 1);
        const end = limit ? start + limit : offseted.length;
        const docs = offseted.slice(start, end);
        return {
            docs,
            total,
            offset,
            limit,
            page,
            pages
        };
    }

    public filter(filters: IUserFilterModel): IUserModel[] {
        return this._filter(this.users.slice(), filters);
    }

    private compare(data: any[], path: string, filter: ICompareNullableDateInput): any[] {
        if (filter.eq !== undefined) {
            if (filter.eq === null) {
                return data.filter(d => d[path] === filter.eq);
            }
            return data.filter(d => {
                const value = d[path];
                if (value) {
                    return new Date(value) === filter.eq;
                }
                return false;
            });
        }

        if (filter.gt) {
            const gt = filter.gt;
            data = data.filter(d => new Date(d[path]) > gt);
        } else if (filter.gte) {
            const gte = filter.gte;
            data = data.filter(d => new Date(d[path]) >= gte);
        }

        if (filter.lt) {
            const lt = filter.lt;
            data = data.filter(d => new Date(d[path]) < lt);
        } else if (filter.lte) {
            const lte = filter.lte;
            data = data.filter(d => new Date(d[path]) <= lte);
        }

        return data;
    }

    private _filter(data: IUserModel[], filters: IUserFilterModel): IUserModel[] {
        try {
            if (filters.active !== undefined) {
                data = data.filter(u => u.active === filters.active);
            }
            if (filters.role) {
                if (filters.role.eq) {
                    const role = filters.role.eq;
                    data = data.filter(user => user.role === role);
                } else if (filters.role.in && filters.role.in.length > 0) {
                    const roles = filters.role.in as string[];
                    data = data.filter(u => roles.indexOf(u.role) > 0);
                }
            }
            if (filters.gender) {
                if (filters.gender.eq) {
                    const gender = filters.gender.eq;
                    data = data.filter(u => u.gender === gender);
                } else if (filters.gender.in) {
                    const genders = filters.gender.in;
                    data = data.filter(u => genders.indexOf(u.gender) > 0);
                }
            }
            if (filters.birthday !== undefined) {
                data = this.compare(data, 'birthday', filters.birthday);
            }
            if (filters.deleted !== undefined) {
                data = data.filter(u => u.deleted === filters.deleted);
            }
            if (filters.deletedAt !== undefined) {
                data = this.compare(data, 'deletedAt', filters.deletedAt);
            }
            if (filters.createdAt) {
                data = this.compare(data, 'createdAt', filters.createdAt);
            }
            if (filters.updatedAt) {
                data = this.compare(data, 'updatedAt', filters.updatedAt);
            }
            if (filters.lastLogin !== undefined) {
                data = this.compare(data, 'lastLogin', filters.lastLogin);
            }
            return data;
        } catch (e) {
            console.error('User filtering failed', e, {filters});
            throw e;
        }
    }
}
