import { UpdateInput } from "../../lib/grapgql/inputs/update.input";
import { IUpdateInputModel } from "../../lib/grapgql/models/update.input.model";
import { DataSource } from './base';

export class UpdateInputData extends DataSource {

    private data: IUpdateInputModel[];

    constructor() {
        super();
        this.data = [];
    }

    public async load(data: IUpdateInputModel[], validate: boolean = true) {
        try {
            console.log('Data validating');
            if (validate) {
                await Promise.all(data.map(d => new UpdateInput(d).validate()));
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
    public get(): IUpdateInputModel {
        return this.choose(this.data);
    }

    /**
     * Returns random multiple create input data
     * @return {IUpdateInputModel[]}
     */
    public multiple(limit: number): IUpdateInputModel[] {
        return this.shuffle(this.data.slice(0, limit));
    }
}
