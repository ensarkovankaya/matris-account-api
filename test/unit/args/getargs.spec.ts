import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GetArgs } from '../../../lib/grapgql/args/get.args';

describe('GetArgs', () => {
    it('should init empty', () => {
        const args = new GetArgs();
        expect(args).to.be.deep.eq({});
    });

    describe('id', () => {
        it('should have id', () => {
            const args = new GetArgs({id: '1'.repeat(24)});
            expect(args).to.be.deep.eq({id: '1'.repeat(24)});
        });
        it('should validate id', async () => {
            await new GetArgs({id: '1'.repeat(24)}).validate();
        });

        it('should raise validation error for id', async () => {
            try {
                await new GetArgs({id: 'shortid'}).validate();
                throw new Error();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('id');
            }

            try {
                await new GetArgs({id: 'longid'.repeat(10)}).validate();
                throw new Error();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('id');
            }
        });
    });

    describe('email', () => {
        it('should validate email', async () => {
            await new GetArgs({email: 'email@mail.com'}).validate();
        });

        it('should raise validation error for email', async () => {
            try {
                await new GetArgs({email: 'notamail'}).validate();
                throw new Error();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('email');
            }
        });
    });

    describe('username', () => {
        it('should validate username', async () => {
            await new GetArgs({username: 'username'}).validate();
        });

        it('should raise validation error', async () => {
            try {
                await new GetArgs({username: 'NotUserName-_*'}).validate();
                throw new Error();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('username');
            }
        });
    });
});
