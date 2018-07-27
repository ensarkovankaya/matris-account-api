import { GraphQLClient } from 'graphql-request';
import { Options } from 'graphql-request/dist/src/types';
import { ArgumentRequired, NotUserField, UnexpectedResponse, UserFieldRequired } from '../error';
import { GetArgs } from '../grapgql/args/get.args';
import { CreateInput } from '../grapgql/inputs/create.input';
import { FilterInput } from '../grapgql/inputs/filter.input';
import { IDInput } from '../grapgql/inputs/id.input';
import { PaginationInput } from '../grapgql/inputs/pagination.input';
import { UpdateInput } from '../grapgql/inputs/update.input';
import { IGetArgs } from '../grapgql/models/args.model';
import { ICreateInputModel } from '../grapgql/models/create.input.model';
import { IPaginateResult, IPaginationOptions } from '../grapgql/models/pagination.model';
import { IUpdateInputModel } from '../grapgql/models/update.input.model';
import { IClientModel } from '../models/client.model';
import { ILoggerModel } from '../models/logger.model';
import { User, UserSchema } from '../models/user';
import { IUserFilterModel } from '../models/user.filter.model';
import { IUserModel, UserField, userFields } from '../models/user.model';
import { BaseService } from './base.service';

export interface IServiceOptions {
    url: string;
    overwrites?: Options;
    client?: IClientModel;
    logger?: ILoggerModel;
}

export class AccountService extends BaseService {

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
        const validatedData = await new GetArgs(by).validate();

        // Get Fragment
        const fragment = this.buildUserFieldFragment(fields);
        try {
            const query = `
                query getUser($id: String, $email: String, $username: String) {
                    user: get(id: $id, email: $email, username: $username) {
                        ...UserFields
                    }
                }
                ${fragment}`;
            const variables = {...validatedData};
            const response = await this.call<{ user: Partial<IUserModel> | null }>(query, variables);
            this.debug('Get', {response});
            response.raise();
            if (response.data === undefined || response.data.user === undefined) {
                throw new UnexpectedResponse();
            }
            return response.data.user ? await User(response.data.user) : null;
        } catch (err) {
            this.error('Get', err);
            throw err;
        }
    }

    /**
     * Make one find call with given filters returns one page of data
     * @param {IUserFilterModel} filter
     * @param {UserField[]} fields
     * @param {IPaginationOptions} pagination
     * @return {Promise<IPaginateResult<Partial<UserSchema>>>}
     */
    public async find(filters: IUserFilterModel,
                      fields: UserField[] = userFields,
                      pagination: IPaginationOptions = new PaginationInput()):
        Promise<IPaginateResult<Partial<UserSchema>>> {
        this.debug('Find', {filters, fields, pagination});
        // Validate arguments
        const validatedFilters = await new FilterInput(filters).validate();
        const validatedPagination = await new PaginationInput(pagination).validate();

        // Get Fragment
        const fragment = this.buildUserFieldFragment(fields);
        const query = `query findUsers($filters: UserFilterInput!, $pagination: PaginationInput) {
                              result: find(filters: $filters, pagination: $pagination) {
                                docs { ...UserFields },
                                total,
                                limit,
                                page,
                                pages,
                                offset
                              }
                            }
                            ${fragment}`;
        const variables = {filters: validatedFilters, pagination: validatedPagination};
        const response = await this.call<{ result: IPaginateResult<Partial<IUserModel>> }>(query, variables);
        this.debug('Find', {response});

        response.raise();

        if (response.data === undefined || response.data.result === undefined) {
            throw new UnexpectedResponse();
        }
        return {
            docs: await Promise.all(response.data.result.docs.map(u => User(u))),
            total: response.data.result.total,
            limit: response.data.result.limit,
            page: response.data.result.page || 1,
            pages: response.data.result.pages || 1,
            offset: response.data.result.offset || 0
        };
    }

    /**
     * Search users with given filters returns iteratable user array
     * @param {IUserFilterModel} filter
     * @param {UserField[]} fields
     * @param {IPaginationOptions} pagination
     * @return {AsyncIterableIterator<Array<Partial<UserSchema>>>}
     */
    public async* search(filter: IUserFilterModel,
                         fields: UserField[] = userFields,
                         pagination: IPaginationOptions = new PaginationInput()):
        AsyncIterableIterator<Array<Partial<UserSchema>>> {
        this.debug('Search', {filter, fields, pagination});
        try {
            let currentPagination = {...pagination};
            while (true) {
                const result = await this.find(filter, fields, currentPagination);
                const page = result.page || 1;
                const pages = result.pages || 1;
                if (page >= pages) {
                    return result.docs;
                }
                currentPagination = {...pagination, page: page + 1};
                yield result.docs;
            }
        } catch (e) {
            this.error('Search', e);
            throw e;
        }
    }

    /**
     * Create user.
     * @param {ICreateInputModel} data
     * @param {UserField[]} fields: Return user fields
     */
    public async create(data: ICreateInputModel, fields: UserField[] = userFields): Promise<Partial<UserSchema>> {
        this.debug('Create', {data, fields});
        const validatedData = await new CreateInput(data).validate();
        try {
            // Get Fragment
            const fragment = this.buildUserFieldFragment(fields);
            // Build query
            const query = `mutation createUser($data: CreateInput!) {
                              user: create(data: $data) { ...UserFields }
                            }
                            ${fragment}`;
            const response = await this.call<{ user: Partial<IUserModel> }>(query, {data: validatedData});
            this.debug('Create', {response});

            response.raise();

            if (!response.data || !response.data.user) {
                throw new UnexpectedResponse();
            }
            return await User(response.data.user);
        } catch (e) {
            this.error('Create', e);
            throw e;
        }
    }

    /**
     * Update user.
     * @param {string} id: Update user id.
     * @param {IUpdateInputModel} data: Update data.
     * @param {UserField[]} fields: Return user fields.
     */
    public async update(
        id: string,
        data: IUpdateInputModel,
        fields: UserField[] = userFields
    ): Promise<Partial<UserSchema>> {
        this.debug('Update', {id, data, fields});
        await new IDInput(id).validate();
        const validatedData = await new UpdateInput(data).validate();
        try {
            // Get Fragment
            const fragment = this.buildUserFieldFragment(fields);
            // Build query
            const query = `mutation updateUser($id: String!, $data: UpdateInput!) {
                              user: update(id: $id, data: $data) { ...UserFields }
                            }
                            ${fragment}`;
            const response = await this.call<{ user: Partial<IUserModel> }>(query, {id, data: validatedData});
            this.debug('Update', {response});

            response.raise();

            if (!response.data || !response.data.user) {
                throw new UnexpectedResponse();
            }
            return await User(response.data.user);
        } catch (e) {
            this.error('Create', e);
            throw e;
        }
    }

    public async delete(id: string): Promise<void> {
        this.debug('Delete', {id});
        await new IDInput(id).validate();
        try {
            // Build query
            const query = 'mutation deleteUser($id: String!) {deleted: delete(id: $id)}';
            const response = await this.call<{deleted: true}>(query, {id});
            this.debug('Delete', {response});

            response.raise();

            if (!response.data || response.data.deleted !== true) {
                throw new UnexpectedResponse();
            }
        } catch (e) {
            this.error('Delete', e);
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
