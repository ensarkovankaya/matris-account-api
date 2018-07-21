import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PaginationInput } from '../../../../lib/grapgql/inputs/pagination.input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('PaginationInput', () => {
    it('should init empty', async () => {
        const input = new PaginationInput();
        await input.validate();
        expect(input).to.be.deep.eq({limit: 10, offset: 0, page: 1});
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
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('page');
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
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('offset');
            }
        });
    });

    describe('limit', () => {
        it('should valid', async () => {
            const input1 = new PaginationInput({limit: 25});
            await input1.validate();
            expect(input1.limit).to.be.eq(25);

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
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('limit');
            }

            try {
                const args = new PaginationInput({limit: 500} as any);
                await args.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                expect(e[0].property).to.be.eq('limit');
            }
        });
    });
});
