import { User, UserSchema } from '../../lib/models/user';
import { UserField } from '../../lib/models/user.model';
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
}

export interface IMultipleFilter extends IUserFilter {
    shuffle?: boolean;
}

export class UserGenerator {

    private users: UserSchema[];

    constructor() {
        this.users = [];
    }

    public async load(data: IDBUserModel[]) {
        try {
            this.users = await Promise.all(data.map(u => User(u)));
        } catch (e) {
            console.error('Load failed', e);
            throw e;
        }
    }
    /**
     * Returns one valid user data
     * @param {IUserFilter} filter
     * @return {UserSchema}
     */
    public get(filter: IUserFilter = {}): UserSchema {
        let filtered = this.users.slice();
        if (filter.role) {
            filtered = filtered.filter(u => u.role === filter.role);
        }
        if (filter.gender) {
            filtered = filtered.filter(u => u.gender === filter.gender);
        }
        if (filtered.length === 0) {
            throw new Error('User not exists');
        }
        return choose<UserSchema>(filtered);
    }

    /**
     * Returns multiple valid user data
     * @param {number} limit
     * @param {IMultipleFilter} filter
     * @return {UserSchema[]}
     */
    public multiple(limit: number, filter: IMultipleFilter = {}): UserSchema[] {
        const users: UserSchema[] = [];
        while (users.length < limit) {
            const chosen = this.get(filter);
            if (!users.find(u => u.id === chosen.id)) {
                users.push(chosen);
            }
        }
        return filter.shuffle ? shuffle(users) : users;
    }

    /**
     * Generates partial user. Returns new user object which have only given fields.
     * @param {UserSchema} user
     * @param {UserField[]} fields
     * @return {Partial<UserSchema>}
     */
    public partial(user: UserSchema, fields: UserField[]): Partial<UserSchema> {
        const obj = {};
        fields.forEach(field => obj[field] = user[field]);
        return obj;
    }
}
