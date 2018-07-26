import { User, UserSchema } from '../../lib/models/user';
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
}
