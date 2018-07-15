import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AccountService } from '../../lib';
import { UserFieldRequired } from '../../lib/error';
import { UserGenerator } from '../data/data';
import { MockGraphQLClient } from './mock.client';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('AccountService', () => {
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
                await service.get({id: '1'}, []);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserFieldRequired');
            }
        });
        it('should add fields to query', async () => {
            const generator = new UserGenerator();
            const mockUser = generator.get();
            const client = new MockGraphQLClient('', {}, {user: {...mockUser}});
            const service = new AccountService({url: '', client});
            await service.get({id: mockUser._id}, ['_id', 'username', 'firstName', 'lastName', 'gender']);

            expect(client.query).to.have.string('query');
            expect(client.query).to.have.string('_id,username,firstName,lastName,gender');
            expect(client.query).to.have.string('get');
            expect(client.query).to.have.string('id: $id');
        });

        it('should add variables to request', async () => {
            const generator = new UserGenerator();
            const mockUser = generator.get();
            const client = new MockGraphQLClient('', {}, {user: {...mockUser}});
            const service = new AccountService({url: '', client});
            await service.get({id: mockUser._id, email: mockUser.email, username: mockUser.username}, ['_id']);

            expect(client.variables).to.have.keys(['id', 'email', 'username']);
        });
    });
});
