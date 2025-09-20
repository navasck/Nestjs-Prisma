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

// AuthGuard
// Purpose: You apply it to a route to enforce authentication.For instance, @UseGuards(AuthGuard('jwt')) tells NestJS to run the jwt strategy(the one you defined with PassportStrategy) before allowing the request to hit the controller.

// How it works: It acts as a gatekeeper.If the authentication strategy succeeds, the guard returns true, and the request proceeds.If it fails(e.g., an invalid token), the guard throws an authentication error.

// Reflector is a NestJS service that allows you to read metadata that has been set by decorators.It's a crucial tool for creating dynamic and declarative logic in your application.

// The JwtAuthGuard and JwtStrategy are connected through the @nestjs/passport library. You won't see a direct import because their connection is managed by the framework's dependency injection and the AuthGuard abstraction.
