import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccountsService } from '../accounts/accounts.service';
import { SignupDTO } from '../dto/signup.dto';
import { Utility } from '../helpers/utils';
import { Accounts } from '../models/accounts.model';
import { UsersService } from '../users/users.service';
import { randomInt } from 'crypto';
import { PERMISSIONS, ROLES, STATUS } from '../enums/all.enum';
import { Users } from '../models/users.model';
import { SigninDTO } from '../dto/signin.dto';
import { ValidationPipe } from '../pipe/joiValidation.pipe';
import { JoiValidation } from '../validations/schema.validation';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly Utils: Utility,
    private readonly usersService: UsersService,
    private readonly accountsService: AccountsService,
  ) { }

  @Post('signup')
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe(JoiValidation.SignupSchema)) payload: SignupDTO
  ) {


    const user = await this.usersService.show({ key1: 'email', value1: payload.email });

    if (user) {
      throw new HttpException(
        `User with email: ${payload.email} already exsit, please signin`,
        HttpStatus.CONFLICT
      )
    };

    payload.password = await this.Utils.bcryptString(payload.password);

    const randNum = randomInt(4);
    const accountPayload: Accounts = {
      account_status: STATUS.ACTIVE,
      users_limit: 5,
      users_used: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const account = await this.accountsService.create(accountPayload);

    if (!account) {
      throw new HttpException(
        `Unable to create account at this moment, please trya gain later`,
        HttpStatus.NOT_IMPLEMENTED
      )
    }

    const userPayload: Users = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      status: STATUS.ACTIVE,
      role: ROLES.ADMIN,
      permissions: [PERMISSIONS.CREATE, PERMISSIONS.READ, PERMISSIONS.UDPATE, PERMISSIONS.DELETE],
      user_id: +`${randNum}${randomInt(2)}`,
      account_id: randNum,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const response = await this.usersService.create(userPayload);

    if (!response) {
      throw new HttpException(
        `Unable to create user at this moment, please trya gain later`,
        HttpStatus.NOT_IMPLEMENTED
      )
    }

    response.password = '';

    res.status(201).json(
      {
        status: true,
        response
      }
    );
  }

  @Post('signin')
  async signin(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe(JoiValidation.SigninSchema)) payload: SigninDTO
  ) {

    const user = await this.usersService.show({ key: 'email', value: payload.email });

    if (!user) {
      throw new HttpException(
        `No user exist with email: ${payload.email}, please signup`,
        HttpStatus.NOT_FOUND
      )
    }

    const decryptedPassword = await this.Utils.decryptString(payload.password, user.password);

    if (!decryptedPassword) {
      throw new HttpException(
        `Incorrect password`,
        HttpStatus.BAD_REQUEST
      )
    }

    const jwtPayload = {
      userId: user.user_id,
      accountId: user.account_id,
      email: user.email
    }

    const token = await this.Utils.signJWT(jwtPayload);

    user.password = '';

    res.status(200).json({
      status: true,
      response: user,
      token
    });

  }

}
