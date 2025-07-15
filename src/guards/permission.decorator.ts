
import { Reflector } from '@nestjs/core';
import { PERMISSIONS } from '../enums/all.enum';

export const Permission = Reflector.createDecorator<PERMISSIONS[]>();
