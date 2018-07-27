import { IsIn, IsNumber, Max, Min } from "class-validator";
import { IPaginationOptions } from '../models/pagination.model';
import { Validatable } from '../validatable';

export class PaginationInput extends Validatable implements IPaginationOptions {

    @IsNumber()
    @Min(1)
    @Max(9999)
    public page?: number;

    @IsNumber()
    @Min(0)
    public offset?: number;

    @IsNumber()
    @IsIn([5, 10, 25, 50, 100, 150])
    public limit?: 5 | 10 | 25 | 50 | 100 | 150;

    constructor(data: IPaginationOptions = {}) {
        super({page: 1, offset: 0, limit: 25, ...data}, ['page', 'offset', 'limit']);
    }
}
