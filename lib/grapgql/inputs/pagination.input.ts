import { IsIn, IsNumber, Max, Min } from "class-validator";
import { IPaginationOptions } from '../models/pagination.model';
import { Validatable } from '../validatable';

export class PaginationInput extends Validatable implements IPaginationOptions {

    @IsNumber()
    @Min(1)
    @Max(9999)
    public page?: number = 1;

    @IsNumber()
    @Min(0)
    public offset?: number = 0;

    @IsNumber()
    @IsIn([10, 25, 50, 100, 150])
    public limit?: 10 | 25 | 50 | 100 | 150 = 10;

    constructor(data: IPaginationOptions = {}) {
        super(data);
    }
}
