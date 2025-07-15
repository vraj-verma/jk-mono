import { ApiProperty } from "@nestjs/swagger";

export class SigninDTO {

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    password: string;
}