import { expect } from 'chai';
import { validateOrReject } from 'class-validator';
import { describe, it } from 'mocha';
import { GetArgs } from '../../../lib/grapgql/args/get.args';

describe('GetArgs', () => {
    it('should init empty', () => {
        const args = new GetArgs();
        expect(args).to.be.deep.eq({});
    });
    it('should have id', () => {
        const args = new GetArgs({id: '1'.repeat(24)});
        expect(args).to.be.deep.eq({id: '1'.repeat(24)});
    });
    it('should validate id', async () => {
        const args = new GetArgs({id: '1'.repeat(24)});
        await validateOrReject(args, {skipMissingProperties: true});
    });
    it('should validate email', async () => {
        const args = new GetArgs({email: 'email@mail.com'});
        await validateOrReject(args, {skipMissingProperties: true});
    });
    it('should validate username', async () => {
        const args = new GetArgs({username: 'username'});
        await validateOrReject(args, {skipMissingProperties: true});
    });
    it('should raise validation error for email', async () => {
        const args = new GetArgs({email: 'notamail'});
        try {
            await validateOrReject(args, {skipMissingProperties: true});
            throw new Error();
        } catch (e) {
            expect(e).to.be.an('array');
            expect(e).to.have.lengthOf(1);
            expect(e[0].property).to.be.eq('email');
        }
    });
    it('should raise validation error for id', async () => {
        try {
            await validateOrReject(new GetArgs({id: 'shortid'}), {skipMissingProperties: true});
            throw new Error();
        } catch (e) {
            expect(e).to.be.an('array');
            expect(e).to.have.lengthOf(1);
            expect(e[0].property).to.be.eq('id');
        }

        try {
            await validateOrReject(new GetArgs({id: 'longid'.repeat(10)}), {skipMissingProperties: true});
            throw new Error();
        } catch (e) {
            expect(e).to.be.an('array');
            expect(e).to.have.lengthOf(1);
            expect(e[0].property).to.be.eq('id');
        }
    });
});
