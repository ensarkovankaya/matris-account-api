import { IsAlphanumeric, IsEmail, IsLowercase, IsString, Length } from 'class-validator';
import { IGetArgs } from '../models/args.model';
import { Validatable } from '../validatable';

export class GetArgs extends Validatable implements IGetArgs {
    @IsString()
    @Length(24, 24, {message: 'id must be equal to 24 characters'})
    public id?: string;

    @Length(4, 32, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @IsEmail()
    public email?: string;

    constructor(data: { id?: string, username?: string, email?: string } = {}) {
        super(data);
    }
}
