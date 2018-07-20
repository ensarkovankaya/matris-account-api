import { expect } from 'chai';
import { describe, it } from 'mocha';
import { UserFieldRequired, UserInvalid } from '../../../lib/error';
import { Gender } from '../../../lib/models/gender.model';
import { Role } from '../../../lib/models/role.model';
import { User } from '../../../lib/models/user';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
    public message = 'This test should not be succeed';
}

describe('User Schema Tests', () => {
    it('should raise UserFieldRequired when empty init', async () => {
        try {
            await User({});
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('UserFieldRequired');
        }
    });

    describe('id', () => {
        it('should invalid id', async () => {
            try {
                await User({_id: '1'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('id');
                expect(e.errors[0].constraints).to.have.key('length');
            }
            try {
                await User({_id: '1'.repeat(26)});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('id');
                expect(e.errors[0].constraints).to.have.key('length');
            }
        });

        it('should valid id', async () => {
            const user = await User({_id: '1'.repeat(24)});
            expect(user.id).to.be.eq('1'.repeat(24));
        });
    });

    describe('username', () => {
        it('should invalid username', async () => {
            try {
                await User({username: 'a'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('username');
                expect(e.errors[0].constraints).to.have.key('length');
            }

            try {
                await User({username: 'asdASsdasd'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('username');
                expect(e.errors[0].constraints).to.have.key('isLowercase');
            }

            try {
                await User({username: 'asd-sdasd'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('username');
                expect(e.errors[0].constraints).to.have.key('isAlphanumeric');
            }
        });

        it('should valid username', async () => {
            const user = await User({username: 'username'});
            expect(user.username).to.be.eq('username');
        });
    });

    describe('firstName', () => {
        it('should invalid firstName', async () => {
            try {
                await User({firstName: 'a'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('firstName');
                expect(e.errors[0].constraints).to.have.key('length');
            }

            try {
                await User({firstName: 'a'.repeat(33)});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('firstName');
                expect(e.errors[0].constraints).to.have.key('length');
            }

            try {
                await User({firstName: 1234} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('firstName');
                expect(e.errors[0].constraints).to.have.keys(['isString', 'matches', 'length']);
            }

            try {
                await User({firstName: 'asd123'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('firstName');
                expect(e.errors[0].constraints).to.have.key('matches');
            }
        });

        it('should valid firstName', async () => {
            const user = await User({firstName: 'First Name'});
            expect(user.firstName).to.be.eq('First Name');
        });
    });

    describe('lastName', () => {
        it('should invalid lastName', async () => {
            try {
                await User({lastName: 'a'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('lastName');
                expect(e.errors[0].constraints).to.have.key('length');
            }

            try {
                await User({lastName: 'a'.repeat(33)});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('lastName');
                expect(e.errors[0].constraints).to.have.key('length');
            }

            try {
                await User({lastName: 1234} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('lastName');
                expect(e.errors[0].constraints).to.have.keys(['isString', 'matches', 'length']);
            }

            try {
                await User({lastName: 'asd123'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('lastName');
                expect(e.errors[0].constraints).to.have.key('matches');
            }
        });

        it('should valid lastName', async () => {
            const user1 = await User({lastName: 'Last Name'});
            expect(user1.lastName).to.be.eq('Last Name');
        });
    });

    describe('role', () => {
        it('should invalid role', async () => {
            try {
                await User({role: 'a'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('role');
                expect(e.errors[0].constraints).to.have.key('isIn');
            }
        });

        it('should valid role', async () => {
            const user1 = await User({role: Role.ADMIN});
            expect(user1.role).to.be.eq('ADMIN');

            const user2 = await User({role: Role.MANAGER});
            expect(user2.role).to.be.eq('MANAGER');

            const user3 = await User({role: Role.INSTRUCTOR});
            expect(user3.role).to.be.eq('INSTRUCTOR');

            const user4 = await User({role: Role.PARENT});
            expect(user4.role).to.be.eq('PARENT');

            const user5 = await User({role: Role.STUDENT});
            expect(user5.role).to.be.eq('STUDENT');
        });
    });

    describe('gender', () => {
        it('should invalid gender', async () => {
            try {
                await User({gender: 'a'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('gender');
                expect(e.errors[0].constraints).to.have.key('isIn');
            }
        });

        it('should valid gender', async () => {
            const user1 = await User({gender: Gender.MALE});
            expect(user1.gender).to.be.eq('MALE');

            const user2 = await User({gender: Gender.FEMALE});
            expect(user2.gender).to.be.eq('FEMALE');

            const user3 = await User({gender: Gender.UNKNOWN});
            expect(user3.gender).to.be.eq('UNKNOWN');
        });
    });

    describe('birthday', () => {
        it('should invalid birthday', async () => {
            try {
                await User({birthday: 'asd'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('birthday');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }
        });

        it('should valid birthday', async () => {
            const user1 = await User({birthday: null});
            expect(user1.birthday).to.be.eq(null);

            const user2 = await User({birthday: '2018-06-26T15:30:46.151Z'} as any);
            expect(user2.birthday).to.be.a('date');

            const user3 = await User({birthday: new Date()});
            expect(user3.birthday).to.be.a('date');
        });
    });

    describe('active', () => {
        it('should invalid active', async () => {
            try {
                await User({active: 'asd'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('active');
                expect(e.errors[0].constraints).to.have.key('isBoolean');
            }

            try {
                await User({active: 0} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('active');
                expect(e.errors[0].constraints).to.have.key('isBoolean');
            }
        });

        it('should valid active', async () => {
            const user1 = await User({active: true});
            expect(user1.active).to.be.a('boolean');

            const user2 = await User({active: false});
            expect(user2.active).to.be.a('boolean');
        });
    });

    describe('createdAt', () => {
        it('should invalid createdAt', async () => {
            try {
                await User({createdAt: 'asd'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('createdAt');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }

            try {
                await User({createdAt: new Date('Invalid Date')});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('createdAt');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }
        });

        it('should valid createdAt', async () => {
            const user1 = await User({createdAt: '2018-06-26T15:30:46.151Z'} as any);
            expect(user1.createdAt).to.be.a('date');

            const user2 = await User({createdAt: new Date()});
            expect(user2.createdAt).to.be.a('date');
        });
    });

    describe('updatedAt', () => {
        it('should invalid updatedAt', async () => {
            try {
                await User({updatedAt: 'asd'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('updatedAt');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }

            try {
                await User({updatedAt: new Date('Invalid Date')});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('updatedAt');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }
        });

        it('should valid updatedAt', async () => {
            const user1 = await User({updatedAt: '2018-06-26T15:30:46.151Z'} as any);
            expect(user1.updatedAt).to.be.a('date');

            const user2 = await User({updatedAt: new Date()});
            expect(user2.updatedAt).to.be.a('date');
        });
    });

    describe('deletedAt', () => {
        it('should invalid deletedAt', async () => {
            try {
                await User({deletedAt: 'asd'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('deletedAt');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }

            try {
                await User({deletedAt: new Date('Invalid Date')});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('deletedAt');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }
        });

        it('should valid deletedAt', async () => {
            const user1 = await User({deletedAt: '2018-06-26T15:30:46.151Z'} as any);
            expect(user1.deletedAt).to.be.a('date');

            const user2 = await User({deletedAt: new Date()});
            expect(user2.deletedAt).to.be.a('date');

            const user3 = await User({deletedAt: null});
            expect(user3.deletedAt).to.be.eq(null);
        });
    });

    describe('deleted', () => {
        it('should invalid deleted', async () => {
            try {
                await User({deleted: 'asd'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('deleted');
                expect(e.errors[0].constraints).to.have.key('isBoolean');
            }
        });

        it('should valid deleted', async () => {
            const user1 = await User({deleted: true});
            expect(user1.deleted).to.be.eq(true);

            const user2 = await User({deleted: false});
            expect(user2.deleted).to.be.eq(false);

        });
    });

    describe('lastLogin', () => {
        it('should invalid lastLogin', async () => {
            try {
                await User({lastLogin: 'asd'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('lastLogin');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }

            try {
                await User({lastLogin: new Date('Invalid Date')});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('lastLogin');
                expect(e.errors[0].constraints).to.have.key('isDate');
            }
        });

        it('should valid lastLogin', async () => {
            const user1 = await User({lastLogin: '2018-06-26T15:30:46.151Z'} as any);
            expect(user1.lastLogin).to.be.a('date');

            const user2 = await User({lastLogin: new Date()});
            expect(user2.lastLogin).to.be.a('date');

            const user3 = await User({lastLogin: null});
            expect(user3.lastLogin).to.be.eq(null);
        });
    });

    describe('groups', () => {
        it('should invalid groups', async () => {
            try {
                await User({groups: 'asd'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('groups');
                expect(e.errors[0].constraints).to.have.key('isArray');
            }

            try {
                await User({groups: ['a'.repeat(3)]});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('groups');
                expect(e.errors[0].constraints).to.have.key('length');
            }

            try {
                await User({groups: ['a'.repeat(26)]});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('groups');
                expect(e.errors[0].constraints).to.have.key('length');
            }

            try {
                await User({groups: ['a'.repeat(24), 'b']});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserInvalid');
                expect(e.errors).to.be.an('array');
                expect(e.errors.length).to.be.eq(1);
                expect(e.errors[0].property).to.be.eq('groups');
                expect(e.errors[0].constraints).to.have.key('length');
            }
        });

        it('should valid groups', async () => {
            const user1 = await User({groups: []});
            expect(user1.groups).to.be.a('array');
            expect(user1.groups).to.have.lengthOf(0);

            const user3 = await User({groups: ['a'.repeat(24)]});
            expect(user3.groups).to.be.a('array');
            expect(user3.groups).to.have.lengthOf(1);
            const user3Groups = user3.groups as string[];
            expect(user3Groups[0]).to.be.eq('a'.repeat(24));
        });
    });
});
