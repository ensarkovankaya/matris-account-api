import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CreateInput } from '../../../../lib/grapgql/inputs/create.input';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('CreateInput', () => {
    it('should raise validation error for required fields', async () => {
        try {
            await new CreateInput().validate();
            throw new ShouldNotSucceed();
        } catch (e) {
            expect(e.name).to.be.eq('ArgumentValidationError');
            expect(e.hasError('email')).to.be.eq(true);
            expect(e.hasError('firstName')).to.be.eq(true);
            expect(e.hasError('lastName')).to.be.eq(true);
            expect(e.hasError('role')).to.be.eq(true);
            expect(e.hasError('password')).to.be.eq(true);
        }
    });

    describe('FirstName', () => {
        it('should be valid for firstName', async () => {
            try {
                await new CreateInput({firstName: 'First Name'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('firstName')).to.be.eq(false);
            }
        });
    });
});
