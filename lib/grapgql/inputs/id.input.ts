import { IsMongoId, IsString } from 'class-validator';
import { Validatable } from '../validatable';

export class IDInput extends Validatable {

    @IsString()
    @IsMongoId()
    public id: string;

    constructor(id: string) {
        super({}, []);
        this.id = id;
    }
}
