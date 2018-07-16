import { GraphQLClient } from 'graphql-request';
import { Options } from 'graphql-request/dist/src/types';
import { BaseService } from './base.service';
import { ArgumentRequired, NotUserField, UserFieldRequired } from './error';
import { FindArgs } from './grapgql/args/find.args';
import { GetArgs } from './grapgql/args/get.args';
import { IGetArgs } from './grapgql/models/args.model';
import { IClientModel } from './models/client.model';
import { ILoggerModel } from './models/logger.model';
import { User, UserSchema } from './models/user';
import { IUserFilterModel, IUserModel, UserField, userFields } from './models/user.model';

export interface IServiceOptions {
    url: string;
    overwrites?: Options;
    client?: IClientModel;
    logger?: ILoggerModel;
}

export class AccountService extends BaseService {

    private url: string;
    private overwrites?: Options;

    constructor(options: IServiceOptions) {
        const overwrites = options.overwrites || {};
        const client = options.client ? options.client : new GraphQLClient(options.url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            ...overwrites
        });
        super(client, options.logger);
        this.url = options.url;
        this.overwrites = options.overwrites;
    }

    /**
     * Get specific user by id, email or username.
     * @param {IGetArgs} by
     * @param {UserField[]} fields
     * @return {Promise<UserSchema | null>}
     */
    public async get(by: IGetArgs, fields: UserField[] = userFields): Promise<UserSchema | null> {
        this.debug('Get', {by, fields});

        if (!by.id && !by.email && !by.username) {
            throw new ArgumentRequired(['id', 'email', 'username']);
        }

        // Validate arguments
        await new GetArgs(by).validate();

        // Get Fragment
        const fragment = this.buildUserFieldFragment(fields);
        try {
            const query = 'query getUser($id: String, $email: String, $username: String)' +
                `{user: get(id: $id, email: $email, username: $username) {...UserFields } }\n${fragment}`;
            const response = await this.call<{ user: Partial<IUserModel> | null }>(query, by);
            this.debug('Get', {response});
            response.raise();
            return response.data.user ? await User(response.data.user) : null;
        } catch (err) {
            this.error('Get', err);
            throw err;
        }
    }

    /**
     * Search users with given filters
     * @param {IUserFilterModel} filter
     * @param {UserField[]} fields
     * @return {Promise<UserSchema[]>}
     */
    public async search(filter: IUserFilterModel = {}, fields: UserField[] = userFields): Promise<UserSchema[]> {
        try {
            this.debug('Find', {filter, fields});
            // Validate arguments
            await new FindArgs(filter).validate();

            // Get Fragment
            const fragment = this.buildUserFieldFragment(fields);
            const query = `query findUsers($active:Boolean, $gender: Gender, $role: RoleQuery, $deleted: Boolean,
                                            $deletedAt: CompareDateInput, $createdAt: CompareDateInput,
                                            $updatedAt: CompareDateInput, $lastLogin: CompareDateInput,
                                            $birthday: CompareDateInput) {
                              find(active: $active, gender: $gender, role: $role, deleted: $deleted,
                                  deletedAt: $deletedAt, createdAt: $createdAt, updatedAt: $updatedAt,
                                  lastLogin: $lastLogin, birthday: $birthday) {
                                    ...UserFields
                              }
                            }
                            ${fragment}`;
            const response = await this.call<{ users: Array<Partial<IUserModel>> }>(query, filter);
            this.debug('Find', {response});
            response.raise();
            return await Promise.all(response.data.users.map(u => User(u)));
        } catch (e) {
            this.error('Find', e);
            throw e;
        }
    }

    /**
     * Builds fragment for User
     * @param {UserField[]} fields
     * @return {string}
     */
    public buildUserFieldFragment(fields: UserField[]): string {
        this.debug('BuildUserFieldFragment', {fields});
        if (fields.length === 0) {
            throw new UserFieldRequired();
        }
        fields.forEach(field => {
            if (!userFields.find(f => f === field)) {
                throw new NotUserField(field);
            }
        });
        return `fragment UserFields on User {\n\t${fields.join(',\n\t')}\n\t}`;
    }
}
