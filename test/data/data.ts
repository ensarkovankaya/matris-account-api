import { ICompareNullableDateInput } from '../../lib/grapgql/models/compare.model';
import { IPaginateResult, IPaginationOptions } from '../../lib/grapgql/models/pagination.model';
import { User } from '../../lib/models/user';
import { IUserFilterModel } from '../../lib/models/user.filter.model';
import { IUserModel, UserField } from '../../lib/models/user.model';
import { IDBUserModel } from './user.model';

/**
 * Shuffles array in place. ES6 version
 * @param {Array} array: Array containing the items.
 */
const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

/**
 * Makes random choice from array
 * @param {any[]} choices
 * @return {any}
 */
const choose = <T>(choices: T[]): T => {
    if (choices.length === 0) {
        throw new Error('Array is empty');
    }
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
};

export interface IUserFilter {
    role?: string;
    gender?: string;
    deleted?: boolean;
    active?: boolean;
}

export interface IMultipleFilter extends IUserFilter {
    shuffle?: boolean;
}

export class UserGenerator {

    private users: IDBUserModel[];

    constructor() {
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
     * Returns one valid user data
     * @param {IUserFilter} filter
     * @return {IUserModel}
     */
    public get(filter: IUserFilter = {}): IUserModel {
        let filtered = this.users.slice();
        if (filter.role) {
            filtered = filtered.filter(u => u.role === filter.role);
        }
        if (filter.gender) {
            filtered = filtered.filter(u => u.gender === filter.gender);
        }
        if (typeof filter.deleted === 'boolean') {
            filtered = filtered.filter(u => u.deleted === filter.deleted);
        }
        if (typeof filter.active === 'boolean') {
            filtered = filtered.filter(u => u.active === filter.active);
        }
        if (filtered.length === 0) {
            throw new Error('User not exists');
        }
        return choose<IUserModel>(filtered);
    }

    /**
     * Returns multiple valid user data
     * @param {number} limit
     * @param {IMultipleFilter} filter
     * @return {IUserModel[]}
     */
    public multiple(limit: number, filter: IMultipleFilter = {}): IUserModel[] {
        const users: IUserModel[] = [];
        while (users.length < limit) {
            const chosen = this.get(filter);
            if (!users.find(u => u._id === chosen._id)) {
                users.push(chosen);
            }
        }
        return filter.shuffle ? shuffle(users) : users;
    }

    /**
     * Generates partial user. Returns new user object which have only given fields.
     * @param {UserSchema} user
     * @param {UserField[]} fields
     * @return {Partial<IUserModel>}
     */
    public partial(user: IUserModel, fields: UserField[]): Partial<IUserModel> {
        const obj = {};
        fields.forEach(field => obj[field] = user[field]);
        return obj;
    }

    public paginate(data: any[], pagination: IPaginationOptions): IPaginateResult<any> {
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
            return data.filter(d => new Date(d[path]) === filter.eq);
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
            if (filters.deletedAt) {
                data = this.compare(data, 'deletedAt', filters.deletedAt);
            }
            if (filters.createdAt) {
                data = this.compare(data, 'createdAt', filters.createdAt);
            }
            if (filters.updatedAt) {
                data = this.compare(data, 'updatedAt', filters.updatedAt);
            }
            if (filters.lastLogin) {
                data = this.compare(data, 'lastLogin', filters.lastLogin);
            }
            if (filters.groups && filters.groups.length > 0) {
                const groups = filters.groups;
                data = data.filter(u => u.groups.some(id => groups.indexOf(id) > 0));
            }
            return data;
        } catch (e) {
            console.error('User filtering failed', e, {filters});
            throw e;
        }
    }
}
