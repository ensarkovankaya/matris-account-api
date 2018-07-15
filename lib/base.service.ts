import { ClientError, Variables } from 'graphql-request/dist/src/types';
import { IClientModel } from './models/client.model';
import { ILoggerModel } from './models/logger.model';
import { APIResponse } from './response';

/**
 * Base GraphQLClient service and Response handler.
 */
export class BaseService {

    constructor(private client: IClientModel, protected logger?: ILoggerModel) {
    }

    public debug(message: string, data?: any) {
        if (this.logger) {
            this.logger.debug(message, data);
        }
    }

    public error(message: string, err: Error, data?: any) {
        if (this.logger) {
            this.logger.error(message, err, data);
        }
    }

    /**
     * Makes request to endpoint
     * @param {string} query
     * @param {Variables} variables
     * @return {Promise<APIResponse<T>>}
     */
    protected async call<T>(query: string, variables?: Variables): Promise<APIResponse<T>> {
        this.debug('Call', {query, variables});
        try {
            return await this.client.request<T>(query, variables)
                .then(data => this.handleResponse<T>(data))
                .catch(err => this.handleError<T>(err));
        } catch (err) {
            this.error('Call', err);
            throw err;
        }
    }

    /***
     * Transform data to APIResponse
     * @param data
     * @return {APIResponse<T>}
     */
    private handleResponse<T>(data: any): APIResponse<T> {
        this.debug('HandleResponse', data);
        return new APIResponse<T>(200, data);
    }

    /***
     * Transform error to APIResponse
     * @param {ClientError} err
     * @return {APIResponse<T>}
     */
    private handleError<T>(err: ClientError): APIResponse<T> {
        this.debug('HandleError', {
            clientError: {
                res: err.response,
                req: err.request,
                name: err.name,
                message: err.message,
                stack: err.stack
            }
        });
        if (err.response && err.response.errors) {
            return new APIResponse<T>(err.response.status, err.response.data, err.response.errors);
        }
        throw err;
    }
}
