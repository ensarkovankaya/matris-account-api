import { CreateInput } from "../../lib/grapgql/inputs/create.input";
import { ICreateInputModel } from "../../lib/grapgql/models/create.input.model";
import { DataSource } from './base';

export class CreateInputData extends DataSource {

    private data: ICreateInputModel[];

    constructor() {
        super();
        this.data = [];
    }

    public async load(data: ICreateInputModel[], validate: boolean = true) {
        try {
            if (validate) {
                await Promise.all(data.map(d => new CreateInput(d).validate()));
            }
            this.data = data;
        } catch (e) {
            console.log('Data validation failed', e);
            throw e;
        }
    }

    /**
     * Returns random one create input data
     * @return {ICreateInputModel}
     */
    public get(): ICreateInputModel {
        return this.choose(this.data);
    }

    /**
     * Returns random multiple create input data
     * @return {ICreateInputModel[]}
     */
    public multiple(limit: number): ICreateInputModel[] {
        return this.shuffle(this.data.slice(0, limit));
    }
}
