import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

// it's a custom NestJS guard that extends the built -in AuthGuard('jwt').It is designed to allow certain routes to be publicly accessible, bypassing JWT authentication.

// Guard
// A Guard in NestJS is a special type of class that determines whether a given request should be handled by a route handler.They are executed before any interceptor, pipe, or controller.Guards are responsible for authorization and access control, acting as a gatekeeper to protect routes based on specific conditions.

// Think of a Guard as an "access control middleware" that checks if a user has the necessary permissions(e.g., is authenticated, has a certain role) to access a resource. .
