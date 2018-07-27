import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GetArgs } from '../../../../lib/grapgql/args/get.args';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Args -> GetArgs', () => {
    it('should init empty', async () => {
        const args = new GetArgs({});
        await args.validate();
        expect(args).to.be.deep.eq({});
    });

    describe('ID', () => {
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
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('id')).to.be.eq(true);
            }

            try {
                await new GetArgs({id: 'longid'.repeat(10)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('id')).to.be.eq(true);
            }
        });
    });

    describe('Email', () => {
        it('should validate email', async () => {
            await new GetArgs({email: 'email@mail.com'}).validate();
        });

        it('should raise validation error for email', async () => {
            try {
                await new GetArgs({email: 'notanemail'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('email')).to.be.eq(true);
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
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username')).to.be.eq(true);
            }
        });
    });
});
