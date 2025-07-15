import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '../models/users.model';
import { Request, Response } from 'express';
import { Utility } from '../helpers/utils';
import { Roles } from '../guards/roles.decorator';
import { ROLES } from '../enums/role.enum';
import { ValidationPipe } from '../pipe/joiValidation.pipe';
import { JoiValidation } from '../validations/schema.validation';
import { AuthUser, Pagination } from '../types/authUser.type';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CreateDTO } from './dto/insert.dto';
import { UpdateDTO } from './dto/update.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Users Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles([ROLES.ADMIN])
@Controller('users')
export class UsersController {

  constructor(
    private readonly Utils: Utility,
    private readonly usersService: UsersService
  ) { }


  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe(JoiValidation.createUserSchema)) payload: CreateDTO
  ) {

    const { account_id } = <AuthUser>req['user'];

    const user = await this.usersService.show({ key: 'email', value: payload.email });

    if (user) {
      throw new HttpException(
        `User with email: ${payload.email} already exist`,
        HttpStatus.CONFLICT
      );
    }

    payload.password = await this.Utils.bcryptString(payload.password);

    const userPayload: Users = {
      account_id,
      email: payload.email,
      name: payload.name,
      password: payload.password,
      role: payload.role,
      permissions: payload.permissions,
      status: payload.status,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const response = await this.usersService.create(userPayload);

    if (!response) {
      throw new HttpException(
        `Unable to create user, please try again later`,
        HttpStatus.NOT_IMPLEMENTED
      )
    }


    res.status(201).json({
      status: true,
      response: `User created!`
    })
  }

  @Get(':id')
  async show(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') userId: number
  ) {

    const response = await this.usersService.show({ key: 'user_id', value: userId });

    if (!response) {
      throw new HttpException(
        `No data found`,
        HttpStatus.NOT_FOUND
      )
    }

    response.password = ''

    res.status(200).json({
      status: true,
      response
    })



  }

  @Get()
  async list(
    @Req() req: Request,
    @Res() res: Response,
    @Query(new ValidationPipe(JoiValidation.PaginationSchema)) paged: Pagination
  ) {

    const { account_id } = req['user'];

    const response = await this.usersService.index(account_id, paged);

    if (!response) {
      throw new HttpException(
        `No data found`,
        HttpStatus.NOT_FOUND
      )
    }

    let total: number | null = response?.length;


    if (paged.offset >= 1 || total >= paged.limit) {
      total = await this.usersService.count(account_id);
    }

    res.status(200).json(
      {
        status: true,
        pagination: {
          total: Number(total),
          offset: paged.offset,
          limit: paged.limit,
          returned: response.length,
        },
        response
      }
    )


  }

  @Patch()
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe(JoiValidation.updateUserSchema)) payload: UpdateDTO
  ) {

    const { account_id, user_id } = <AuthUser>req['user'];

    payload.account_id = account_id;
    payload.user_id = user_id;
    payload.updated_at = new Date();

    const response = await this.usersService.update(payload)

    if (!response) {
      throw new HttpException(
        `Unable to update user at this moment`,
        HttpStatus.NOT_IMPLEMENTED
      );
    }
    response.password = '';

    res.status(200).json(
      {
        status: true,
        response
      }
    );

  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) userId: number
  ) {

    const { account_id, } = <AuthUser>req['user'];

    const response = await this.usersService.delete(account_id, userId);

    if (!response) {
      throw new HttpException(
        `Either already deleted or does not exist`,
        HttpStatus.NOT_FOUND
      );
    }

    res.status(200).json({
      status: true,
      response: `Deleted SUccessfully!`
    })

  }


}
