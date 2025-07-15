import {
  Get,
  Req,
  Res,
  Body,
  Post,
  Query,
  Param,
  Delete,
  UseGuards,
  Controller,
  HttpStatus,
  UploadedFile,
  ParseIntPipe,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { Utility } from '../helpers/utils';
import { Request, Response } from 'express';
import { InsertDTO } from './dto/Insert.dto';
import { DocsService } from './docs.service';
import { PERMISSIONS } from '../enums/all.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AwsS3BucketService } from '../aws/aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Permission } from '../guards/permission.decorator';
import { ValidationPipe } from '../pipe/joiValidation.pipe';
import { PermissionGuard } from '../guards/permission.guard';
import { AuthUser, Pagination } from 'src/types/authUser.type';
import { JoiValidation } from '../validations/schema.validation';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('docs')
export class DocsController {

  constructor(
    private readonly utils: Utility,
    private readonly docsService: DocsService,
    private readonly awsService: AwsS3BucketService,
  ) { }


  @Post()
  @Permission([PERMISSIONS.CREATE])
  @UseInterceptors(FileInterceptor('file'))
  async add(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: InsertDTO
  ) {

    if (!file) {
      throw new HttpException(
        `Please provide document`,
        HttpStatus.BAD_REQUEST
      )
    }

    const { name, account_id, user_id } = <AuthUser>req['user']

    const compressedFile = await this.utils.compressor(file, name);

    const awsURL = await this.awsService.uploadOnAwsS3Bucket({ name: 'docs' }, compressedFile);

    if (!awsURL) {
      throw new HttpException(
        `Unable to upload doc on cloud, please try again`,
        HttpStatus.NOT_IMPLEMENTED
      )
    }

    const docPayload: InsertDTO = {
      account_id,
      user_id,
      url: awsURL,
      title: payload.title,
      description: payload.description,
      size: compressedFile.size,
      created_at: new Date(),
      updated_at: new Date()
    }

    const response = await this.docsService.create(docPayload);

    if (!response) {
      throw new HttpException(
        `Unable to save doc on db, please try again`,
        HttpStatus.NOT_IMPLEMENTED
      )
    }

    res.status(201).json({
      status: true,
      response: awsURL
    })

  }

  @Get()
  async list(
    @Req() req: Request,
    @Res() res: Response,
    @Query(new ValidationPipe(JoiValidation.PaginationSchema)) paged: Pagination
  ) {

    const { account_id } = <AuthUser>req['user']

    const response = await this.docsService.list(account_id, paged);

    if (!response) {
      throw new HttpException(
        `No data found`,
        HttpStatus.NOT_FOUND
      )
    }

    let total: number | null = response.length;

    if (paged.offset >= 1 || total >= paged.limit) {
      total = await this.docsService.count(account_id);
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
        response,
      }
    )


  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) docId: number
  ) {

    const { account_id } = <AuthUser>req['user'];

    const response = await this.docsService.delete(account_id, docId);

    if (!response) {
      throw new HttpException(
        `Either already deleted or does not bleongs to your account`,
        HttpStatus.NOT_FOUND
      )
    }

    res.status(200).json({
      status: true,
      response: `Deleted successfully!`
    })

  }

}
