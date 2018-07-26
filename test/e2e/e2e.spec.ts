import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { AccountService } from '../../lib';
import { UserGenerator } from '../data/data';
import { readFileSync } from 'fs';
import { IDBUserModel } from '../data/user.model';
import {RootLogger} from 'matris-logger';

const URL = process.env.URL || 'http://localhost:3000/graphql';
const rootLogger = new RootLogger({level: 'debug'});
const service = new AccountService({url: URL, logger: rootLogger.getLogger('AccountService')});
const generator = new UserGenerator();

before('Load Users', async () => {
    const USERS: IDBUserModel[] = JSON.parse(readFileSync(__dirname + '/../data/valid.json', 'utf8'));
    await generator.load(USERS);
});

describe('E2E', async () => {
    describe('Get', () => {
        it('should get user by id', async () => {
            const mockUser = generator.get({deleted: false});
            const user = await service.get({id: mockUser._id}) as any;
            expect(user).to.be.an('object');
            expect(user).to.have.keys([
                'id',
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
            
            const createdAt = new Date(mockUser.createdAt);
            expect(user.createdAt.getFullYear()).to.be.eq(createdAt.getFullYear());
            expect(user.createdAt.getMonth()).to.be.eq(createdAt.getMonth());
            expect(user.createdAt.getDay()).to.be.eq(createdAt.getDay());
            
            const updatedAt = new Date(mockUser.updatedAt);
            expect(user.updatedAt.getFullYear()).to.be.eq(updatedAt.getFullYear());
            expect(user.updatedAt.getMonth()).to.be.eq(updatedAt.getMonth());
            expect(user.updatedAt.getDay()).to.be.eq(updatedAt.getDay());
            
            if (mockUser.deletedAt) {
                const deletedAt = new Date(mockUser.deletedAt);
                expect(user.deletedAt.getFullYear()).to.be.eq(deletedAt.getFullYear());
                expect(user.deletedAt.getMonth()).to.be.eq(deletedAt.getMonth());
                expect(user.deletedAt.getDay()).to.be.eq(deletedAt.getDay());
            } else {
                expect(user.deletedAt).to.be.eq(null);
            }
            expect(user.deleted).to.be.eq(mockUser.deleted);
            expect(user.role).to.be.eq(mockUser.role);
            if (mockUser.lastLogin) {
                const lastLogin = new Date(mockUser.lastLogin);
                expect(user.lastLogin.getFullYear()).to.be.eq(lastLogin.getFullYear());
                expect(user.lastLogin.getMonth()).to.be.eq(lastLogin.getMonth());
                expect(user.lastLogin.getDay()).to.be.eq(lastLogin.getDay());
            } else {
                expect(user.lastLogin).to.be.eq(null);
            }
            expect(user.gender).to.be.eq(mockUser.gender);
            expect(user.active).to.be.eq(mockUser.active);
            if (mockUser.birthday) {
                const birthday = new Date(mockUser.birthday);
                expect(user.birthday.getFullYear()).to.be.eq(birthday.getFullYear());
                expect(user.birthday.getMonth()).to.be.eq(birthday.getMonth());
                expect(user.birthday.getDay()).to.be.eq(birthday.getDay());
            } else {
                expect(user.birthday).to.be.eq(null);
            }
            expect(user.groups).to.be.deep.eq(mockUser.groups);
        });
        
        it('should get user by email', async () => {
            const mockUser = generator.get({deleted: false});
            const user = await service.get({email: mockUser.email}) as any;
            expect(user).to.be.an('object');
            expect(user).to.have.keys([
                'id',
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
            
            const createdAt = new Date(mockUser.createdAt);
            expect(user.createdAt.getFullYear()).to.be.eq(createdAt.getFullYear());
            expect(user.createdAt.getMonth()).to.be.eq(createdAt.getMonth());
            expect(user.createdAt.getDay()).to.be.eq(createdAt.getDay());
            
            const updatedAt = new Date(mockUser.updatedAt);
            expect(user.updatedAt.getFullYear()).to.be.eq(updatedAt.getFullYear());
            expect(user.updatedAt.getMonth()).to.be.eq(updatedAt.getMonth());
            expect(user.updatedAt.getDay()).to.be.eq(updatedAt.getDay());
            
            if (mockUser.deletedAt) {
                const deletedAt = new Date(mockUser.deletedAt);
                expect(user.deletedAt.getFullYear()).to.be.eq(deletedAt.getFullYear());
                expect(user.deletedAt.getMonth()).to.be.eq(deletedAt.getMonth());
                expect(user.deletedAt.getDay()).to.be.eq(deletedAt.getDay());
            } else {
                expect(user.deletedAt).to.be.eq(null);
            }
            expect(user.deleted).to.be.eq(mockUser.deleted);
            expect(user.role).to.be.eq(mockUser.role);
            if (mockUser.lastLogin) {
                const lastLogin = new Date(mockUser.lastLogin);
                expect(user.lastLogin.getFullYear()).to.be.eq(lastLogin.getFullYear());
                expect(user.lastLogin.getMonth()).to.be.eq(lastLogin.getMonth());
                expect(user.lastLogin.getDay()).to.be.eq(lastLogin.getDay());
            } else {
                expect(user.lastLogin).to.be.eq(null);
            }
            expect(user.gender).to.be.eq(mockUser.gender);
            expect(user.active).to.be.eq(mockUser.active);
            if (mockUser.birthday) {
                const birthday = new Date(mockUser.birthday);
                expect(user.birthday.getFullYear()).to.be.eq(birthday.getFullYear());
                expect(user.birthday.getMonth()).to.be.eq(birthday.getMonth());
                expect(user.birthday.getDay()).to.be.eq(birthday.getDay());
            } else {
                expect(user.birthday).to.be.eq(null);
            }
            expect(user.groups).to.be.deep.eq(mockUser.groups);
        });
        
        it('should get user by username', async () => {
            const mockUser = generator.get({deleted: false});
            const user = await service.get({username: mockUser.username}) as any;
            expect(user).to.be.an('object');
            expect(user).to.have.keys([
                'id',
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
            
            const createdAt = new Date(mockUser.createdAt);
            expect(user.createdAt.getFullYear()).to.be.eq(createdAt.getFullYear());
            expect(user.createdAt.getMonth()).to.be.eq(createdAt.getMonth());
            expect(user.createdAt.getDay()).to.be.eq(createdAt.getDay());
            
            const updatedAt = new Date(mockUser.updatedAt);
            expect(user.updatedAt.getFullYear()).to.be.eq(updatedAt.getFullYear());
            expect(user.updatedAt.getMonth()).to.be.eq(updatedAt.getMonth());
            expect(user.updatedAt.getDay()).to.be.eq(updatedAt.getDay());
            
            if (mockUser.deletedAt) {
                const deletedAt = new Date(mockUser.deletedAt);
                expect(user.deletedAt.getFullYear()).to.be.eq(deletedAt.getFullYear());
                expect(user.deletedAt.getMonth()).to.be.eq(deletedAt.getMonth());
                expect(user.deletedAt.getDay()).to.be.eq(deletedAt.getDay());
            } else {
                expect(user.deletedAt).to.be.eq(null);
            }
            expect(user.deleted).to.be.eq(mockUser.deleted);
            expect(user.role).to.be.eq(mockUser.role);
            if (mockUser.lastLogin) {
                const lastLogin = new Date(mockUser.lastLogin);
                expect(user.lastLogin.getFullYear()).to.be.eq(lastLogin.getFullYear());
                expect(user.lastLogin.getMonth()).to.be.eq(lastLogin.getMonth());
                expect(user.lastLogin.getDay()).to.be.eq(lastLogin.getDay());
            } else {
                expect(user.lastLogin).to.be.eq(null);
            }
            expect(user.gender).to.be.eq(mockUser.gender);
            expect(user.active).to.be.eq(mockUser.active);
            if (mockUser.birthday) {
                const birthday = new Date(mockUser.birthday);
                expect(user.birthday.getFullYear()).to.be.eq(birthday.getFullYear());
                expect(user.birthday.getMonth()).to.be.eq(birthday.getMonth());
                expect(user.birthday.getDay()).to.be.eq(birthday.getDay());
            } else {
                expect(user.birthday).to.be.eq(null);
            }
            expect(user.groups).to.be.deep.eq(mockUser.groups);
        });
        
        it('should return null for deleted user', async () => {
            const mockUser = generator.get({deleted: true});
            const user = await service.get({id: mockUser._id}) as any;
            expect(user).to.be.eq(null);
        });
        
        it('should return user with partial fields', async () => {
            const mockUser = generator.get({deleted: false});
            const user = await service.get({id: mockUser._id}, ['_id', 'active', 'role']) as any;
            expect(user).to.be.an('object');
            expect(user).to.have.keys(['id', 'active', 'role']);
            expect(user.id).to.be.eq(mockUser._id);
            expect(user.active).to.be.eq(mockUser.active);
            expect(user.role).to.be.eq(mockUser.role);
        });
        
        it('should return inactive user', async () => {
            const mockUser = generator.get({deleted: false, active: false});
            const user = await service.get({id: mockUser._id}, ['_id', 'active']) as any;
            expect(user).to.be.an('object');
            expect(user).to.have.keys(['id', 'active']);
            expect(user.id).to.be.eq(mockUser._id);
            expect(user.active).to.be.eq(false);
        });
    })
});
