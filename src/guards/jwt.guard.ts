import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';


@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Missing token');
        }

        try {
            const payload = await this.jwtService.verify(token, {
                secret: 'jwtConstants.secret',
            });


            const validatedUser = await this.validate(request, payload);

            request['user'] = validatedUser;
        } catch (err) {
            throw new UnauthorizedException(err.message || 'Unauthorized', err);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async validate(req: Request, payload: any) {
        const email = payload.email;
        const user = await this.userService.show({ key: 'email', value: email });

        if (!user) {
            throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED);
        }

        if (user.status !== 1) {
            throw new HttpException(
                `Unauthorized, Your account is not Active`,
                HttpStatus.UNAUTHORIZED,
            );
        }

        return { ...user };
    }
}
