import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CreateInputData } from './create';
import { ICreateInputModel } from '../../lib/grapgql/models/create.input.model';
import { readFileSync } from 'fs';

const inputs: ICreateInputModel[] = JSON.parse(readFileSync(__dirname + '/valid/create_data.json', 'utf8'));

describe('Data -> CreateInputData', () => {
    it('should load and validate data', async () => {
        await new CreateInputData().load(inputs);
    })

    it('is should get one data', async () => {
        const createInputData = new CreateInputData();
        await createInputData.load(inputs.slice(0, 5));
        const data = createInputData.get();
        expect(data).to.be.an('object');
        expect(data.firstName).to.be.a('string');
        expect(data.lastName).to.be.a('string');
        expect(data.role).to.be.a('string');
        expect(data.email).to.be.a('string');
    });

    it('should get multiple data', async () => {
        const createInputData = new CreateInputData();
        await createInputData.load(inputs.slice(0, 20));
        const data = createInputData.multiple(10);
        expect(data).to.be.an('array');
        expect(data).to.have.lengthOf(10);
    });
});
