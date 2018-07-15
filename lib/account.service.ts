import { GraphQLClient } from 'graphql-request';
import { Options } from 'graphql-request/dist/src/types';
import { BaseService } from './base.service';
import { ArgumentRequired, UserFieldRequired } from './error';
import { GetArgs } from './grapgql/args/get.args';
import { IGetArgs } from './grapgql/args/get.args.model';
import { IClientModel } from './models/client.model';
import { ILoggerModel } from './models/logger.model';
import { User, UserSchema } from './models/user';
import { IUserModel, UserField } from './models/user.model';

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

    public async get(by: IGetArgs, fields: UserField[]): Promise<UserSchema | null> {
        this.debug('Get', {by, fields});

        if (!by.id && !by.email && !by.username) {
            throw new ArgumentRequired(['id', 'email', 'username']);
        }
        if (fields.length === 0) {
            throw new UserFieldRequired();
        }

        // Validate arguments
        await new GetArgs(by).validate();

        try {
            const query = `query getUser($id: String, $email: String, $username: String) {
                    user: get(id: $id, email: $email, username: $username) {
                        ${fields.join(',')}
                    }
            }`;
            const response = await this.call<{ user: Partial<IUserModel> | null }>(query, by);
            this.debug('Get', {response});
            response.raise();
            return response.data.user ? await User(response.data.user) : null;
        } catch (err) {
            this.error('Get', err);
            throw err;
        }
    }

    public async find(filter) {
        try {
            this.debug('Find');
        } catch (e) {
            this.error('Find', e);
            throw e;
        }
    }
}
