import { expect } from 'chai';
import { describe, it } from 'mocha';
import { FindArgs } from '../../../lib/grapgql/args/filter.args';
import { Gender } from '../../../lib/models/gender.model';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('FindArgs', () => {
    it('should init empty', () => {
        const args = new FindArgs();
        expect(args).to.be.deep.eq({});
    });
    describe('active', () => {
        it('should valid for active', async () => {
            const args = new FindArgs({active: true});
            await args.validate();
            expect(args).to.be.deep.eq({active: true});
        });

        it('should raise validation error for active', async () => {
            try {
                const args = new FindArgs({active: 'a'} as any);
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('active');
            }
        });
    });

    describe('gender', () => {
        describe('eq', () => {
            it('should valid for gender equal MALE', async () => {
                const args = new FindArgs({gender: {eq: Gender.MALE}});
                await args.validate();
                expect(args).to.be.deep.eq({gender: {eq: 'MALE'}});
            });
            it('should valid for gender equal FEMALE', async () => {
                const args = new FindArgs({gender: {eq: Gender.FEMALE}});
                await args.validate();
                expect(args).to.be.deep.eq({gender: {eq: 'FEMALE'}});
            });
            it('should valid for gender equal UNKNOWN', async () => {
                const args = new FindArgs({gender: {eq: Gender.UNKNOWN}});
                await args.validate();
                expect(args).to.be.deep.eq({gender: {eq: 'UNKNOWN'}});
            });

            it('should raise ValidationError', async () => {
                try {
                    const args = new FindArgs({gender: {eq: 'notagender'}} as any);
                    await args.validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    expect(e[0].property).to.be.eq('gender');
                }
            });
        });

        describe('in', () => {
            it('should valid for gender equal MALE', async () => {
                const args = new FindArgs({gender: {eq: Gender.MALE}});
                await args.validate();
                expect(args).to.be.deep.eq({gender: {eq: 'MALE'}});
            });
        });
    });

    describe('deleted', () => {
        it('should be valid for deleted equals true', async () => {
            const args = new FindArgs({deleted: true});
            await args.validate();
            expect(args).to.be.deep.eq({deleted: true});
        });

        it('should be valid for deleted equals false', async () => {
            const args = new FindArgs({deleted: false});
            await args.validate();
            expect(args).to.be.deep.eq({deleted: false});
        });

        it('should raise validation error for deleted', async () => {
            try {
                const args = new FindArgs({deleted: 'a'} as any);
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('deleted');
            }
        });
    });

    describe('deletedAt', () => {
        it('should valid for deletedAt', async () => {
            const date = new Date();
            const args = new FindArgs({
                deletedAt: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
            await args.validate();
            expect(args).to.be.deep.eq({
                deletedAt: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
        });
        it('should raise validation error for deletedAt', async () => {
            try {
                const args = new FindArgs({
                    deletedAt: {
                        eq: 'date',
                        gte: 'date',
                        gt: 'date',
                        lt: 'date',
                        lte: 'date'
                    } as any
                });
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('deletedAt');
            }
        });
    });

    describe('createdAt', () => {
        it('should valid for createdAt', async () => {
            const date = new Date();
            const args = new FindArgs({
                createdAt: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
            await args.validate();
            expect(args).to.be.deep.eq({
                createdAt: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
        });
        it('should raise validation error for createdAt', async () => {
            try {
                const args = new FindArgs({
                    createdAt: {
                        eq: 'date',
                        gte: 'date',
                        gt: 'date',
                        lt: 'date',
                        lte: 'date'
                    } as any
                });
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('createdAt');
            }
        });
    });

    describe('updatedAt', () => {
        it('should valid for updatedAt', async () => {
            const date = new Date();
            const args = new FindArgs({
                updatedAt: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
            await args.validate();
            expect(args).to.be.deep.eq({
                updatedAt: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
        });
        it('should raise validation error for updatedAt', async () => {
            try {
                const args = new FindArgs({
                    updatedAt: {
                        eq: 'date',
                        gte: 'date',
                        gt: 'date',
                        lt: 'date',
                        lte: 'date'
                    } as any
                });
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('updatedAt');
            }
        });
    });

    describe('lastLogin', () => {
        it('should valid for lastLogin', async () => {
            const date = new Date();
            const args = new FindArgs({
                lastLogin: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
            await args.validate();
            expect(args).to.be.deep.eq({
                lastLogin: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
        });
        it('should raise validation error for lastLogin', async () => {
            try {
                const args = new FindArgs({
                    lastLogin: {
                        eq: 'date',
                        gte: 'date',
                        gt: 'date',
                        lt: 'date',
                        lte: 'date'
                    } as any
                });
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('lastLogin');
            }
        });
    });

    describe('birthday', () => {
        it('should valid for birthday', async () => {
            const date = new Date();
            const args = new FindArgs({
                birthday: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
            await args.validate();
            expect(args).to.be.deep.eq({
                birthday: {
                    eq: date,
                    gte: date,
                    gt: date,
                    lt: date,
                    lte: date
                }
            });
        });
        it('should raise validation error for birthday', async () => {
            try {
                const args = new FindArgs({
                    birthday: {
                        eq: 'date',
                        gte: 'date',
                        gt: 'date',
                        lt: 'date',
                        lte: 'date'
                    } as any
                });
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('birthday');
            }
        });
    });

    describe('groups', () => {
        it('should valid for groups', async () => {
            await new FindArgs({groups: []}).validate();
            await new FindArgs({groups: ['1'.repeat(24)]}).validate();
        });

        it('should raise validation error for groups', async () => {
            try {
                await new FindArgs({groups: 'a'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('groups');
            }

            try {
                await new FindArgs({groups: ['shortid']} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('groups');
            }

            try {
                await new FindArgs({groups: ['longid'.repeat(10)]} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('groups');
            }
        });
    });
});
