
import { Reflector } from '@nestjs/core';
import { ROLES } from 'src/enums/role.enum';

export const Roles = Reflector.createDecorator<ROLES[]>();
