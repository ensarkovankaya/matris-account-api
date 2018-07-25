import { IsAlphanumeric, IsEmail, IsLowercase, IsString, Length, ValidateIf } from 'class-validator';
import { IGetArgs } from '../models/args.model';
import { Validatable } from '../validatable';

export class GetArgs extends Validatable implements IGetArgs {
    @ValidateIf(((object, value) => value !== undefined))
    @IsString()
    @Length(24, 24, {message: 'id must be equal to 24 characters'})
    public id?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @Length(4, 32, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @ValidateIf(((object, value) => value !== undefined))
    @IsEmail()
    public email?: string;

    constructor(data: { id?: string, username?: string, email?: string }) {
        super(data);
    }
}
