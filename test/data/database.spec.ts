import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { Database } from './database.data';
import { readFileSync } from 'fs';
import { Role } from '../../lib/models/role.model';
import { Gender } from '../../lib/models/gender.model';
import { IDBUserModel } from './database.data.model';

let database: Database;

before('Loading Database', async () => {
    try {
        const USERS: IDBUserModel[] = JSON.parse(readFileSync(__dirname + '/../data/database.json', 'utf8'));
        database = new Database();
        await database.load(USERS);
    } catch (e) {
        console.log('Loading Data Failed', e);
        throw e;
    }
});

describe('Data -> Database', () => {
    it('should get one valid user', async () => {
        const user = database.get();
        expect(user).to.be.an('object');
        expect(user._id).to.be.a('string');
        expect(user.username).to.be.a('string');
        expect(user.email).to.be.a('string');
        expect(user.firstName).to.be.a('string');
        expect(user.gender).to.be.oneOf(['MALE', 'FEMALE', 'UNKNOWN']);
        expect(user.role).to.be.oneOf(['ADMIN', 'MANAGER', 'INSTRUCTOR', 'PARENT', 'STUDENT']);
        expect(user.deleted).to.be.a('boolean');
        expect(user.active).to.be.a('boolean');
        expect(user.updatedAt).to.be.a('string');
        expect(user.createdAt).to.be.a('string');
        if (user.birthday !== null) {
            expect(user.birthday).to.be.a('string');
        }
        if (user.lastLogin !== null) {
            expect(user.lastLogin).to.be.a('string');
        }
        if (user.deletedAt !== null) {
            expect(user.deletedAt).to.be.a('string');
            expect(user.deleted).to.be.eq(true);
        }
    });
    it('should get one valid user with filter', () => {
        const user = database.get({role: {eq: Role.ADMIN}, gender: {eq: Gender.MALE}});
        expect(user).to.be.an('object');
        expect(user._id).to.be.a('string');
        expect(user.username).to.be.a('string');
        expect(user.email).to.be.a('string');
        expect(user.firstName).to.be.a('string');
        expect(user.gender).to.be.eq('MALE');
        expect(user.role).to.be.eq('ADMIN');
        expect(user.deleted).to.be.a('boolean');
        expect(user.active).to.be.a('boolean');
        expect(user.updatedAt).to.be.a('string');
        expect(user.createdAt).to.be.a('string');
        if (user.birthday !== null) {
            expect(user.birthday).to.be.a('string');
        }
        if (user.lastLogin !== null) {
            expect(user.lastLogin).to.be.a('string');
        }
        if (user.deletedAt !== null) {
            expect(user.deletedAt).to.be.a('string');
            expect(user.deleted).to.be.eq(true);
        }
    });
    it('should get multiple users', () => {
        const users = database.multiple(2);
        expect(users).to.have.lengthOf(2);
        expect(users[0]).to.be.not.deep.eq(users[1]);
    });
    it('should get multiple users with filter', () => {
        const users = database.multiple(2, {gender: {eq: Gender.MALE}, role: {eq: Role.STUDENT}});
        expect(users).to.have.lengthOf(2);
        expect(users[0]).to.be.not.deep.eq(users[1]);
        
        expect(users[0].gender).to.be.eq('MALE');
        expect(users[1].gender).to.be.eq('MALE');
        
        expect(users[0].role).to.be.eq('STUDENT');
        expect(users[1].role).to.be.eq('STUDENT');
    });
    it('should get partial user', () => {
        const user = database.get();
        const partial = database.partial(user, ['_id', 'email', 'role']);
        expect(partial).to.have.keys(['_id', 'email', 'role']);
    });
});
