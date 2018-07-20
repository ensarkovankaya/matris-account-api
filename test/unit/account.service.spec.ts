import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AccountService } from '../../lib';
import { UnexpectedResponse, UserFieldRequired } from '../../lib/error';
import { Gender } from '../../lib/models/gender.model';
import { Role } from '../../lib/models/role.model';
import { UserSchema } from '../../lib/models/user';
import { UserGenerator } from '../data/data';
import { MockGraphQLClient } from './mock.client';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('AccountService Unit Tests', () => {

    describe('Build UserField Fragment', () => {
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
            const service = new AccountService({url: '', client, logger: console});
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
            const generator = new UserGenerator();
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
            const generator = new UserGenerator();
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
        it('should raise UserFieldRequired', async () => {
            try {
                const client = new MockGraphQLClient('', {});
                const service = new AccountService({url: '', client});
                await service.search({}, []);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserFieldRequired');
            }
        });

        it('should raise UnexpectedResponse', async () => {
            const client = new MockGraphQLClient('', {});
            const service = new AccountService({url: '', client});
            try {
                await service.search({active: true}, ['_id']);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UnexpectedResponse');
            }
        });

        it('should add fields to query', async () => {
            const client = new MockGraphQLClient('', {}, {users: []});
            const service = new AccountService({url: '', client});
            await service.search({}, ['_id', 'username', 'firstName', 'lastName', 'gender']);

            expect(client.query).to.have.string('query');
            expect(client.query).to.have.string('_id,\n\tusername,\n\tfirstName,\n\tlastName,\n\tgender');
            expect(client.query).to.have.string('find(');
        });

        it('should add variables to request', async () => {
            const client = new MockGraphQLClient('', {}, {users: []});
            const service = new AccountService({url: '', client});
            await service.search({
                active: true,
                role: {
                    eq: Role.ADMIN,
                },
                gender: {eq: Gender.MALE},
                birthday: {
                    gte: new Date('05/19/1994')
                },
                deleted: false
            }, ['_id']);
            expect(client.variables).to.have.keys(['active', 'role', 'gender', 'birthday', 'deleted']);
        });

        it('should return requested user', async () => {
            const generator = new UserGenerator();
            const mockUser = generator.get();
            const client = new MockGraphQLClient('', {}, {users: [mockUser]});
            const service = new AccountService({url: '', client});
            const users = await service.search({active: true}) as UserSchema[];
            expect(users).to.be.an('array');
            const user = users[0];
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
});
