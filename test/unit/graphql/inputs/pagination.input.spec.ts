import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PaginationInput } from '../../../../lib/grapgql/inputs/pagination.input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> PaginationInput', () => {
    it('should init empty', async () => {
        const input = new PaginationInput();
        await input.validate();
        expect(input).to.be.deep.eq({limit: 25, offset: 0, page: 1});
    });
    describe('page', () => {
        it('should valid', async () => {
            const input1 = new PaginationInput({page: 2});
            await input1.validate();
            expect(input1.page).to.be.eq(2);

            const input2 = new PaginationInput({page: 50});
            await input2.validate();
            expect(input2.page).to.be.eq(50);
        });

        it('should raise validation error', async () => {
            try {
                const args = new PaginationInput({page: 'a'} as any);
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('page')).to.be.eq(true);
            }
        });
    });

    describe('offset', () => {
        it('should valid', async () => {
            const input1 = new PaginationInput({offset: 2});
            await input1.validate();
            expect(input1.offset).to.be.eq(2);

            const input2 = new PaginationInput({offset: 50});
            await input2.validate();
            expect(input2.offset).to.be.eq(50);
        });

        it('should raise validation error', async () => {
            try {
                const args = new PaginationInput({offset: 'a'} as any);
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('offset')).to.be.eq(true);
            }
        });
    });

    describe('limit', () => {
        it('should valid', async () => {
            const input1 = new PaginationInput({limit: 10});
            await input1.validate();
            expect(input1.limit).to.be.eq(10);

            const input2 = new PaginationInput({limit: 50});
            await input2.validate();
            expect(input2.limit).to.be.eq(50);
        });

        it('should raise validation error', async () => {
            try {
                const args = new PaginationInput({limit: 'a'} as any);
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('limit')).to.be.eq(true);
            }

            try {
                const args = new PaginationInput({limit: 500} as any);
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('limit')).to.be.eq(true);
            }
        });
    });
});
