import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { AccountService } from '../../../lib';
import { Gender } from '../../../lib/models/gender.model';
import { UserSchema } from '../../../lib/models/user';
import { userFields } from '../../../lib/models/user.model';
import { UserGenerator } from '../../data/data';
import { MockGraphQLClient } from '../mock.client';
import { readFileSync } from 'fs';
import { IDBUserModel } from '../../data/user.model';
import { Role } from '../../../lib/models/role.model';

const generator = new UserGenerator();

before('Load Data', async () => {
    const USERS: IDBUserModel[] = JSON.parse(readFileSync(__dirname + '/../../data/valid.json', 'utf8'));
    await generator.load(USERS);
});

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

class MethodCalled extends Error {
    public name = 'MethodCalled';
    
    constructor(public method: string, public data?: any) {
        super();
    }
}

describe('AccountService Unit Tests', async () => {
    
    describe('buildUserFieldFragment', () => {
        it('should build', () => {
            const client = new MockGraphQLClient('', {});
            const service = new AccountService({url: '', client});
            const fragment = service.buildUserFieldFragment(['_id', 'email']);
            expect(fragment).to.be.eq(`fragment UserFields on User {\n\t_id,\n\temail\n\t}`);
        });
        
        it('should raise NotUserField', () => {
            try {
                const client = new MockGraphQLClient('', {});
                const service = new AccountService({url: '', client});
                service.buildUserFieldFragment(['surname'] as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('NotUserField');
            }
        });
        
        it('should raise UserFieldRequired', () => {
            try {
                const client = new MockGraphQLClient('', {});
                const service = new AccountService({url: '', client});
                service.buildUserFieldFragment([]);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserFieldRequired');
            }
        });
    });
    
    describe('GET', () => {
        it('should raise ArgumentRequired', async () => {
            const client = new MockGraphQLClient('', {});
            const service = new AccountService({url: '', client});
            try {
                await service.get({}, ['_id', 'email']);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentRequired');
            }
        });
        it('should raise UserFieldRequired', async () => {
            const client = new MockGraphQLClient('', {});
            const service = new AccountService({url: '', client});
            try {
                await service.get({id: '1'.repeat(24)}, []);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserFieldRequired');
            }
        });
        it('should raise UnexpectedResponse', async () => {
            const client = new MockGraphQLClient('', {});
            const service = new AccountService({url: '', client});
            try {
                await service.get({id: '1'.repeat(24)}, ['_id']);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UnexpectedResponse');
            }
        });
        it('should add fields to query', async () => {
            const client = new MockGraphQLClient('', {}, {user: null});
            const service = new AccountService({url: '', client});
            await service.get({id: '1'.repeat(24)}, ['_id', 'username', 'firstName', 'lastName', 'gender']);
            
            expect(client.query).to.have.string('query');
            expect(client.query).to.have.string('_id,\n\tusername,\n\tfirstName,\n\tlastName,\n\tgender');
            expect(client.query).to.have.string('get(');
            expect(client.query).to.have.string('id: $id');
        });
        
        it('should add variables to request', async () => {
            const mockUser = generator.get();
            const client = new MockGraphQLClient('', {}, {user: null});
            const service = new AccountService({url: '', client});
            await service.get({
                id: mockUser._id,
                email: mockUser.email,
                username: mockUser.username
            }, ['_id']);
            expect(client.variables).to.have.keys(['id', 'email', 'username']);
        });
        
        it('should return requested user', async () => {
            const mockUser = generator.get();
            const client = new MockGraphQLClient('', {}, {user: mockUser});
            const service = new AccountService({url: '', client});
            const user = await service.get({id: mockUser._id}) as UserSchema;
            expect(user).to.be.an('object');
            expect(user.id).to.be.deep.eq(mockUser._id);
            expect(user.active).to.be.eq(mockUser.active);
            if (mockUser.birthday !== null) {
                expect(user.birthday).to.be.a('date');
            } else {
                expect(user.birthday).to.be.eq(null);
            }
            expect(user.createdAt).to.be.a('date');
            expect(user.updatedAt).to.be.a('date');
            expect(user.deleted).to.be.eq(mockUser.deleted);
            if (mockUser.deletedAt !== null) {
                expect(user.deletedAt).to.be.a('date');
            } else {
                expect(user.deletedAt).to.be.eq(null);
            }
            expect(user.email).to.be.eq(mockUser.email);
            expect(user.firstName).to.be.eq(mockUser.firstName);
            expect(user.lastName).to.be.eq(mockUser.lastName);
            expect(user.groups).to.be.deep.eq(mockUser.groups);
            if (mockUser.lastLogin !== null) {
                expect(user.lastLogin).to.be.a('date');
            } else {
                expect(user.lastLogin).to.be.eq(null);
            }
            expect(user.role).to.be.eq(mockUser.role);
            expect(user.username).to.be.eq(mockUser.username);
        });
    });
    
    describe('Find', () => {
        it('should build query', async () => {
            const client = new MockGraphQLClient('', {}, {
                result: {
                    docs: [],
                    total: 0,
                    limit: 25,
                    page: 1,
                    pages: 1,
                    offset: 0
                }
            });
            const service = new AccountService({url: '', client});
            await service.find({});
            expect(client.query).to.have.string('$filters: UserFilterInput!, $pagination: PaginationInput');
            expect(client.query).to.have.string('result: find(filters: $filters, pagination: $pagination)');
            expect(client.query).to.have.string('docs { ...UserFields },');
            expect(client.query).to.have.string('total,');
            expect(client.query).to.have.string('limit,');
            expect(client.query).to.have.string('page,');
            expect(client.query).to.have.string('pages,');
            expect(client.query).to.have.string('offset');
            expect(client.query).to.have.string('fragment UserFields on User');
        });
        
        it('should send variables', async () => {
            const client = new MockGraphQLClient('', {}, {
                result: {
                    docs: [],
                    total: 0,
                    limit: 25,
                    page: 1,
                    pages: 1,
                    offset: 0
                }
            });
            const service = new AccountService({url: '', client});
            const date = new Date();
            await service.find({
                active: true,
                gender: {eq: Gender.FEMALE},
                deleted: false,
                createdAt: {eq: date}
            });
            expect(client.variables).to.deep.eq({
                filters: {
                    active: true,
                    gender: {eq: Gender.FEMALE},
                    deleted: false,
                    createdAt: {eq: date}
                },
                pagination: {
                    page: 1,
                    offset: 0,
                    limit: 25
                }
            });
        });
        
        it('should return result', async () => {
            const client = new MockGraphQLClient('', {}, {
                result: {
                    docs: [],
                    total: 0,
                    limit: 25,
                    page: 1,
                    pages: 1,
                    offset: 0
                }
            });
            const service = new AccountService({url: '', client});
            const result = await service.find({});
            expect(result).to.be.an('object');
            expect(result).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
            expect(result.docs).to.be.an('array');
            expect(result.docs).to.have.lengthOf(0);
            expect(result.total).to.be.eq(0);
            expect(result.limit).to.be.eq(25);
            expect(result.page).to.be.eq(1);
            expect(result.pages).to.be.eq(1);
            expect(result.offset).to.be.eq(0);
        });
        
        it('should transform result to User object', async () => {
            const mockUsers = generator.multiple(10);
            const client = new MockGraphQLClient('', {}, {
                result: {
                    docs: mockUsers,
                    total: mockUsers.length,
                    limit: 25,
                    page: 1,
                    pages: 1,
                    offset: 0
                }
            });
            const service = new AccountService({url: '', client});
            const result = await service.find({});
            expect(result).to.be.an('object');
            expect(result).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
            expect(result.docs).to.be.an('array');
            expect(result.docs).to.have.lengthOf(10);
            expect(result.docs.map(u => u.id)).to.deep.eq(mockUsers.map(u => u._id));
            expect(result.total).to.be.eq(10);
            expect(result.limit).to.be.eq(25);
            expect(result.page).to.be.eq(1);
            expect(result.pages).to.be.eq(1);
            expect(result.offset).to.be.eq(0);
        });
        
        it('should set default values for page, pages and offset if return null', async () => {
            const client = new MockGraphQLClient('', {}, {
                result: {
                    docs: [],
                    total: 0,
                    limit: 25,
                    page: null,
                    pages: null,
                    offset: null
                }
            });
            const service = new AccountService({url: '', client});
            const result = await service.find({});
            expect(result.page).to.be.eq(1);
            expect(result.pages).to.be.eq(1);
            expect(result.offset).to.be.eq(0);
        });
    });
    
    describe('Search', () => {
        it('should return iterator', async () => {
            const client = new MockGraphQLClient('', {}, {
                result: {
                    docs: [],
                    total: 0,
                    limit: 25,
                    page: 1,
                    pages: 1,
                    offset: 0
                }
            });
            const service = new AccountService({url: '', client});
            const iterator = service.search({});
            expect(iterator.next).to.be.a('function');
        });
        
        it('should call call method from Service', async () => {
            class Client {
                
                public async request(query: string, variables: object) {
                    throw new MethodCalled('request', {query, variables});
                }
            }
            
            const client = new Client();
            const service = new AccountService({url: '', client: client as any});
            try {
                const iterator = service.search({});
                expect(iterator.next).to.be.a('function');
                await iterator.next();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.method).to.be.eq('request');
                expect(e.data).to.have.keys(['query', 'variables']);
            }
        });
        
        it('should iterate', async () => {
            const mockUsers = generator.multiple(25);
            
            class Client {
                
                public count = 0;
                
                public async request(query: string, variables: object) {
                    if (this.count === 0) {
                        this.count++;
                        return {
                            result: {
                                docs: mockUsers.slice(0, 10),
                                total: 25,
                                limit: 10,
                                page: 1,
                                pages: 3,
                                offset: 0
                            }
                        };
                    } else if (this.count === 1) {
                        this.count++;
                        return {
                            result: {
                                docs: mockUsers.slice(10, 20),
                                total: 25,
                                limit: 10,
                                page: 2,
                                pages: 3,
                                offset: 0
                            }
                        };
                    }
                    return {
                        result: {
                            docs: mockUsers.slice(20),
                            total: 25,
                            limit: 10,
                            page: 3,
                            pages: 3,
                            offset: 0
                        }
                    };
                }
            }
            
            const client = new Client();
            const service = new AccountService({url: '', client: client as any});
            const iterator = service.search({}, userFields, {limit: 10});
            expect(iterator.next).to.be.a('function');
            
            const iterResult1 = await iterator.next();
            expect(iterResult1).to.be.an('object');
            expect(iterResult1).to.have.keys(['value', 'done']);
            expect(iterResult1.done).to.be.eq(false);
            expect(iterResult1.value).to.be.an('array');
            expect(iterResult1.value.map(u => u.id))
                .to.be.deep.eq(mockUsers.slice(0, 10).map(u => u._id));
            
            const iterResult2 = await iterator.next();
            expect(iterResult2).to.be.an('object');
            expect(iterResult2).to.have.keys(['value', 'done']);
            expect(iterResult2.done).to.be.eq(false);
            expect(iterResult2.value).to.be.an('array');
            expect(iterResult2.value.map(u => u.id))
                .to.be.deep.eq(mockUsers.slice(10, 20).map(u => u._id));
            
            const iterResult3 = await iterator.next();
            expect(iterResult3).to.be.an('object');
            expect(iterResult3).to.have.keys(['value', 'done']);
            expect(iterResult3.done).to.be.eq(true);
            expect(iterResult3.value).to.be.an('array');
            expect(iterResult3.value.map(u => u.id))
                .to.be.deep.eq(mockUsers.slice(20).map(u => u._id));
        });
    });
    
    describe('Delete', () => {
        it('should raise ArgumentValidationError for id', async () => {
            try {
                const client = new MockGraphQLClient('', {});
                const service = new AccountService({url: '', client});
                await service.delete('id');
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('id')).to.be.eq(true);
            }
        });

        it('should raise UnexpectedResponse', async () => {
            try {
                const client = new MockGraphQLClient('', {}, {deleted: false});
                const service = new AccountService({url: '', client});
                await service.delete('1'.repeat(24));
                throw new ShouldNotSucceed();
            } catch(e) {
                expect(e.name).to.be.eq('UnexpectedResponse');
            }
        });
    
        it('should call with query and variables', async () => {
            const client = new MockGraphQLClient('', {}, {deleted: true});
            const service = new AccountService({url: '', client});
            await service.delete('1'.repeat(24));
            expect(client.query).to.be.eq('mutation deleteUser($id: String!) {deleted: delete(id: $id)}')
            expect(client.variables).to.be.deep.eq({id: '1'.repeat(24)});
        });
    });

    describe('Create', () => {
        it('should raise ArgumentValidationError', async () => {
            try {
                const client = new MockGraphQLClient('', {});
                const service = new AccountService({url: '', client});
                await service.create({} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.errors).to.be.an('object');
                expect(e.errors).to.have.keys(['email', 'firstName', 'lastName', 'role', 'password']);
                expect(e.hasError('email')).to.be.eq(true);
                expect(e.hasError('firstName')).to.be.eq(true);
                expect(e.hasError('lastName')).to.be.eq(true);
                expect(e.hasError('role')).to.be.eq(true);
                expect(e.hasError('password')).to.be.eq(true);
            }
        });

        it('should call with query and variables', async () => {
            const client = new MockGraphQLClient('', {}, {user: {
                email: 'mail@mail.com',
                firstName: 'First Name',
                lastName: 'Last Name',
                role: Role.ADMIN
            }});
            const service = new AccountService({url: '', client});
            await service.create({
                email: 'mail@mail.com',
                firstName: 'First Name',
                lastName: 'Last Name',
                role: Role.ADMIN,
                password: '12345678'
            }, ['_id']);
            expect(client.variables).to.be.deep.eq({data: {
                email: 'mail@mail.com',
                firstName: 'First Name',
                lastName: 'Last Name',
                role: Role.ADMIN,
                password: '12345678'
            }});
            expect(client.query).to.have.string('_id');
            expect(client.query).to.not.have.string('email');
        });

        it('should raise UnexpectedResponse', async () => {
            try {
                const client = new MockGraphQLClient('', {}, {key: 'value'});
                const service = new AccountService({url: '', client});
                await service.create({
                    email: 'mail@mail.com',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    role: Role.ADMIN,
                    password: '12345678'
                });
                throw new ShouldNotSucceed();
            } catch(e) {
                expect(e.name).to.be.eq('UnexpectedResponse');
            }
        });
    });
});
