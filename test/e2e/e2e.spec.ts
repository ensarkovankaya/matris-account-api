import { expect } from 'chai';
import { readFileSync } from 'fs';
import { RootLogger } from 'matris-logger';
import { before, describe, it } from 'mocha';
import { AccountService } from '../../lib';
import { IPaginationOptions } from '../../lib/grapgql/models/pagination.model';
import { Gender } from '../../lib/models/gender.model';
import { Role } from '../../lib/models/role.model';
import { IUserFilterModel } from '../../lib/models/user.filter.model';
import { userFields } from '../../lib/models/user.model';
import { Database } from '../data/database.data';
import { IDBUserModel } from '../data/database.data.model';
import { ICreateInputModel } from '../../lib/grapgql/models/create.input.model';
import { CreateInputData } from '../data/create';

const URL = process.env.URL || 'http://localhost:3000/graphql';
const rootLogger = new RootLogger({level: 'debug'});
const service = new AccountService({url: URL, logger: rootLogger.getLogger('AccountService')});
let database: Database;
let createData: CreateInputData;

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

before('Load Users', async () => {
    const DB_DATA: IDBUserModel[] = JSON.parse(readFileSync(__dirname + '/../data/database.json', 'utf8'));
    database = new Database();
    await database.load(DB_DATA);

    const CREATE_INPUTS: ICreateInputModel[] = JSON.parse(readFileSync(__dirname + '/../data/valid/create_data.json', 'utf8'));
    createData = new CreateInputData();
    await createData.load(CREATE_INPUTS);
});

describe('E2E', async () => {
    describe('Get', () => {
        it('should get user by id', async () => {
            const mockUser = database.get({deleted: false});
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
            const mockUser = database.get({deleted: false});
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
            const mockUser = database.get({deleted: false});
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
            const mockUser = database.get({deleted: true});
            const user = await service.get({id: mockUser._id}) as any;
            expect(user).to.be.eq(null);
        });

        it('should return user with partial fields', async () => {
            const mockUser = database.get({deleted: false});
            const user = await service.get({id: mockUser._id}, ['_id', 'active', 'role']) as any;
            expect(user).to.be.an('object');
            expect(user).to.have.keys(['id', 'active', 'role']);
            expect(user.id).to.be.eq(mockUser._id);
            expect(user.active).to.be.eq(mockUser.active);
            expect(user.role).to.be.eq(mockUser.role);
        });

        it('should return inactive user', async () => {
            const mockUser = database.get({deleted: false, active: false});
            const user = await service.get({id: mockUser._id}, ['_id', 'active']) as any;
            expect(user).to.be.an('object');
            expect(user).to.have.keys(['id', 'active']);
            expect(user.id).to.be.eq(mockUser._id);
            expect(user.active).to.be.eq(false);
        });
    });

    describe('Create', () => {
        it('should create user', async () => {

            const createUser = async (data: ICreateInputModel) => {
                const user = await service.create(data);
                expect(user).to.be.an('object');
                expect(user).to.have.keys(['id', 'email', 'firstName', 'lastName', 'username', 'createdAt',
                    'updatedAt', 'deletedAt', 'deleted', 'role', 'lastLogin', 'gender', 'active', 'birthday', 'groups']);
                // Must data
                expect(user.email).to.be.eq(data.email);
                expect(user.firstName).to.be.eq(data.firstName);
                expect(user.lastName).to.be.eq(data.lastName);
                expect(user.role).to.be.eq(data.role);
                // Optional
                if (data.gender) {
                    expect(user.gender).to.be.eq(data.gender);
                } else {
                    expect(user.gender).to.be.eq(Gender.UNKNOWN);
                }
                if (data.username) {
                    expect(user.username).to.be.eq(data.username);
                } else {
                    expect(user.username).to.be.a('string');
                }
                if (data.active !== undefined) {
                    expect(user.active).to.be.eq(data.active);
                } else {
                    expect(user.active).to.be.eq(true);
                }
                if (data.birthday) {
                    expect(user.birthday).to.be.a('date');
                    const birthday = user.birthday as Date;
                    expect(birthday.toJSON()).to.be.eq(new Date(data.birthday).toJSON());
                } else {
                    expect(user.birthday).to.be.eq(null);
                }
                // Default
                expect(user.groups).to.be.an('array');
                expect(user.groups).to.have.lengthOf(0);
                
                expect(user.createdAt).to.be.a('date');
                expect(user.updatedAt).to.be.a('date');
                expect(user.deletedAt).to.be.eq(null);
                expect(user.deleted).to.be.eq(false);
                expect(user.id).to.be.a('string');
                expect(user.id).to.have.lengthOf(24);
                expect(user.lastLogin).to.be.eq(null);
            }
            const inputs = createData.multiple(10);
            for (const data of inputs) {
                await createUser(data);
            }
        }).timeout(5000);

        it('should raise EmailAlreadyExists', async () => {
            try {
                const user = database.get({deleted: false});
                const createData: ICreateInputModel = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    password: '12345678'
                }
                await service.create(createData);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('APIError');
                expect(e.hasError('EmailAlreadyExists')).to.be.eq(true);
            }
        });

        it('should raise UserNameExists', async () => {
            try {
                const user = database.get({deleted: false});
                const createData: ICreateInputModel = {
                    email: 'mail@mail.com',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    password: '12345678',
                    username: user.username
                }
                await service.create(createData);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('APIError');
                expect(e.hasError('UserNameExists')).to.be.eq(true);
            }
        });
    });

    describe('Find', () => {
        it('should return deleted admins', async () => {
            const filter: IUserFilterModel = {role: {eq: Role.ADMIN}, deleted: true};
            const pagination: IPaginationOptions = {limit: 100};
            const mockUsers = database.filter(filter);
            const expectedResult = database.paginate(mockUsers, pagination);
            const result = await service.find(filter, userFields, pagination);
            expect(result).to.be.an('object');
            expect(result).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
            expect(result.total).to.be.eq(expectedResult.total);
            expect(result.page).to.be.eq(expectedResult.page);
            expect(result.pages).to.be.eq(expectedResult.pages);
            expect(result.offset).to.be.eq(expectedResult.offset);
            expect(result.docs).to.be.an('array');
            expect(result.docs).to.have.lengthOf(expectedResult.docs.length);
            for (const user of result.docs) {
                expect(user).to.be.an('object');
                expect(user).to.have.keys(['id', 'email', 'firstName', 'lastName', 'username', 'createdAt',
                    'updatedAt', 'deletedAt', 'deleted', 'role', 'lastLogin', 'gender', 'active', 'birthday',
                    'groups']);
            }
            expect(result.docs.map(u => u.id).sort()).to.be.deep.eq(expectedResult.docs.map(u => u._id).sort());
        });

        it('should return not active female instructors', async () => {
            const filter: IUserFilterModel = {
                role: {eq: Role.INSTRUCTOR},
                gender: {eq: Gender.FEMALE},
                active: false
            };
            const pagination: IPaginationOptions = {limit: 100};
            const mockUsers = database.filter(filter);
            const expectedResult = database.paginate(mockUsers, pagination);
            const result = await service.find(filter, userFields, pagination);
            expect(result).to.be.an('object');
            expect(result).to.have.keys(['docs', 'total', 'limit', 'page', 'pages', 'offset']);
            expect(result.total).to.be.eq(expectedResult.total);
            expect(result.page).to.be.eq(expectedResult.page);
            expect(result.pages).to.be.eq(expectedResult.pages);
            expect(result.offset).to.be.eq(expectedResult.offset);
            expect(result.docs).to.be.an('array');
            expect(result.docs).to.have.lengthOf(expectedResult.docs.length);
            for (const user of result.docs) {
                expect(user).to.be.an('object');
                expect(user).to.have.keys(['id', 'email', 'firstName', 'lastName', 'username',
                    'createdAt', 'updatedAt', 'deletedAt', 'deleted', 'role', 'lastLogin', 'gender', 'active',
                    'birthday', 'groups'
                ]);
            }
            expect(result.docs.map(u => u.id).sort()).to.be.deep.eq(expectedResult.docs.map(u => u._id).sort());
        });
    });
});
