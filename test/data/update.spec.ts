import { expect } from 'chai';
import { describe, it } from 'mocha';
import { readFileSync } from 'fs';
import { IUpdateInputModel } from '../../lib/grapgql/models/update.input.model';
import { UpdateInputData } from './update';

const inputs: IUpdateInputModel[] = JSON.parse(readFileSync(__dirname + '/valid/update_data.json', 'utf8'));

describe('Data -> UpdateInputData', () => {
    it('should load and validate data', async () => {
        await new UpdateInputData().load(inputs);
    });

    it('is should get one data', async () => {
        const updateInputData = new UpdateInputData();
        await updateInputData.load(inputs.slice(0, 5));
        const data = updateInputData.get();
        expect(data).to.be.an('object');
    });

    it('should get multiple data', async () => {
        const updateInputData = new UpdateInputData();
        await updateInputData.load(inputs.slice(0, 20));
        const data = updateInputData.multiple(10);
        expect(data).to.be.an('array');
        expect(data).to.have.lengthOf(10);
    });
});
