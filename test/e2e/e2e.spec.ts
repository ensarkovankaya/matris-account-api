import { expect } from 'chai';
import { describe, it } from 'mocha';
import { AccountService } from '../../lib';
import { UserGenerator } from '../data/data';
import { readFileSync } from 'fs';
import { IDBUserModel } from '../data/user.model';
import { IUser } from '../../lib/models/user.model';
import { UserSchema } from '../../lib/models/user';

const URL = process.env.URL || 'http://localhost:3000/graphql';
const USERS: IDBUserModel[] = JSON.parse(readFileSync(__dirname + '/../data/valid.json', 'utf8'));

describe('E2E', async () => {
    const service = new AccountService({url: URL});
    const generator = new UserGenerator();
    await generator.load(USERS);

    it('should get user by id', async () => {
        const mockUser = generator.get();
        const user = await service.get({id: mockUser._id}) as any;
        
        expect(user).to.be.an('object');
        expect(user).to.have.keys([
            '_id',
            'email',
            'firstName',
            'lastName',
            'username',
            'createdAt',
            'updatedAt',
            'deletedAt',
            'deleted',
            'role',
            'lastLogin',
            'gender',
            'active',
            'birthday',
            'groups'
        ]);

        expect(user.id).to.be.eq(mockUser._id);
        expect(user.email).to.be.eq(mockUser.email);
        expect(user.firstName).to.be.eq(mockUser.firstName);
        expect(user.lastName).to.be.eq(mockUser.lastName);
        expect(user.username).to.be.eq(mockUser.username);
        expect(user.createdAt.toJSON()).to.be.eq(mockUser.createdAt);
        expect(user.updatedAt.toJSON()).to.be.eq(mockUser.updatedAt);
        if (mockUser.deletedAt) {
            expect(user.deletedAt.toJSON()).to.be.eq(mockUser.deletedAt);
        } else {
            expect(user.deletedAt).to.be.eq(null);
        }
        expect(user.deleted).to.be.eq(mockUser.deleted);
        expect(user.role).to.be.eq(mockUser.role);
        if (mockUser.lastLogin) {
            expect(user.lastLogin.toJSON()).to.be.eq(mockUser.lastLogin);
        } else {
            expect(user.lastLogin).to.be.eq(null);
        }
        expect(user.gender).to.be.eq(mockUser.gender);
        expect(user.active).to.be.eq(mockUser.active);
        if (mockUser.birthday) {
            expect(user.birthday.toJSON()).to.be.eq(mockUser.birthday);
        } else {
            expect(user.birthday).to.be.eq(null);
        }
        expect(user.groups).to.be.deep.eq(mockUser.groups);
    });
});
