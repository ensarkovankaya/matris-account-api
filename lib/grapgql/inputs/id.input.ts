import { IsMongoId } from 'class-validator';
import { Validatable } from '../validatable';

export class IDInput extends Validatable {

    @IsMongoId()
    public id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }
}
