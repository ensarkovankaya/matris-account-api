import { IsAlphanumeric, IsEmail, IsLowercase, IsString, Length } from 'class-validator';
import { BaseArg } from './base.arg';
import { IGetArgs } from './get.args.model';

export class GetArgs extends BaseArg implements IGetArgs {
    @IsString()
    @Length(24, 24)
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
