import { IsEmail, Length } from "class-validator";
import { IPasswordInput } from "../models/password.input.model";
import { Validatable } from "../validatable";

export class PasswordInput extends Validatable {
    @IsEmail({}, {message: 'InvalidEmail'})
    public email: string;

    @Length(8, 40, {message: 'InvalidLength'})
    public password: string;

    constructor(data: IPasswordInput) {
        super({}, ['email', 'password']);
        this.email = data.email;
        this.password = data.password;
    }
}
