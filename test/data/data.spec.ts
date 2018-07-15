import { expect } from 'chai';
import { describe, it } from 'mocha';
import { UserGenerator } from './data';

describe('UserGenerator', () => {
    it('should get one valid user', () => {
        const generator = new UserGenerator();
        const user = generator.get();
        console.log('User:', user);
        expect(user).to.be.an('object');
        expect(user._id).to.be.a('string');
        expect(user.username).to.be.a('string');
        expect(user.email).to.be.a('string');
        expect(user.firstName).to.be.a('string');
        expect(user.gender).to.be.oneOf(['MALE', 'FEMALE', null]);
        expect(user.role).to.be.oneOf(['ADMIN', 'MANAGER', 'INSTRUCTOR', 'PARENT', 'STUDENT']);
        expect(user.groups).to.be.an('array');
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
        const generator = new UserGenerator();
        const user = generator.get({role: 'ADMIN', gender: 'MALE'});
        console.log('User:', user);
        expect(user).to.be.an('object');
        expect(user._id).to.be.a('string');
        expect(user.username).to.be.a('string');
        expect(user.email).to.be.a('string');
        expect(user.firstName).to.be.a('string');
        expect(user.gender).to.be.eq('MALE');
        expect(user.role).to.be.eq('ADMIN');
        expect(user.groups).to.be.an('array');
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
        const generator = new UserGenerator();
        const users = generator.multiple(2);
        expect(users).to.have.lengthOf(2);
        expect(users[0]).to.be.not.deep.eq(users[1]);
    });
    it('should get multiple users with filter', () => {
        const generator = new UserGenerator();
        const users = generator.multiple(2, {gender: 'MALE', role: 'STUDENT'});
        expect(users).to.have.lengthOf(2);
        expect(users[0]).to.be.not.deep.eq(users[1]);

        expect(users[0].gender).to.be.eq('MALE');
        expect(users[1].gender).to.be.eq('MALE');

        expect(users[0].role).to.be.eq('STUDENT');
        expect(users[1].role).to.be.eq('STUDENT');
    });
    it('should get partial user', () => {
        const generator = new UserGenerator();
        const user = generator.get();
        const partial = generator.partial(user, ['_id', 'email', 'role']);
        expect(partial).to.have.keys(['_id', 'email', 'role']);
    });
});
