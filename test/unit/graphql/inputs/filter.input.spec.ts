import { expect } from 'chai';
import { describe, it } from 'mocha';
import { FilterInput } from '../../../../lib/grapgql/inputs/filter.input';
import { Gender } from '../../../../lib/models/gender.model';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('FilterInput', () => {
    it('should init empty', () => {
        const args = new FilterInput();
        expect(args).to.be.deep.eq({});
    });
    describe('active', () => {
        it('should valid for active', async () => {
            const args = new FilterInput({active: true});
            await args.validate();
            expect(args).to.be.deep.eq({active: true});
        });

        it('should raise validation error for active', async () => {
            try {
                const args = new FilterInput({active: 'a'} as any);
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
                const args = new FilterInput({gender: {eq: Gender.MALE}});
                await args.validate();
                expect(args).to.be.deep.eq({gender: {eq: 'MALE'}});
            });
            it('should valid for gender equal FEMALE', async () => {
                const args = new FilterInput({gender: {eq: Gender.FEMALE}});
                await args.validate();
                expect(args).to.be.deep.eq({gender: {eq: 'FEMALE'}});
            });
            it('should valid for gender equal UNKNOWN', async () => {
                const args = new FilterInput({gender: {eq: Gender.UNKNOWN}});
                await args.validate();
                expect(args).to.be.deep.eq({gender: {eq: 'UNKNOWN'}});
            });

            it('should raise ValidationError', async () => {
                try {
                    const args = new FilterInput({gender: {eq: 'notagender'}} as any);
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
                const args = new FilterInput({gender: {eq: Gender.MALE}});
                await args.validate();
                expect(args).to.be.deep.eq({gender: {eq: 'MALE'}});
            });
        });
    });

    describe('deleted', () => {
        it('should be valid for deleted equals true', async () => {
            const args = new FilterInput({deleted: true});
            await args.validate();
            expect(args).to.be.deep.eq({deleted: true});
        });

        it('should be valid for deleted equals false', async () => {
            const args = new FilterInput({deleted: false});
            await args.validate();
            expect(args).to.be.deep.eq({deleted: false});
        });

        it('should raise validation error for deleted', async () => {
            try {
                const args = new FilterInput({deleted: 'a'} as any);
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
            const args = new FilterInput({
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
                const args = new FilterInput({
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
            const args = new FilterInput({
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
                const args = new FilterInput({
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
            const args = new FilterInput({
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
                const args = new FilterInput({
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
            const args = new FilterInput({
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
                const args = new FilterInput({
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
            const args = new FilterInput({
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
                const args = new FilterInput({
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
            await new FilterInput({groups: []}).validate();
            await new FilterInput({groups: ['1'.repeat(24)]}).validate();
        });

        it('should raise validation error for groups', async () => {
            try {
                await new FilterInput({groups: 'a'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('groups');
            }

            try {
                await new FilterInput({groups: ['shortid']} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('groups');
            }

            try {
                await new FilterInput({groups: ['longid'.repeat(10)]} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('groups');
            }
        });
    });
});