import { ApiProperty } from "@nestjs/swagger";

export class SignupDTO {

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String, minLength: 8, maxLength: 100 })
    password: string;
}