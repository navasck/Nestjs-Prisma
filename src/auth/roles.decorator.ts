import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// This code defines a custom decorator in NestJS called @Roles.Its purpose is to attach metadata to a class or a method, which can then be read by a Guard to enforce role - based access control.

// SetMetadata: This is a NestJS function that attaches key - value metadata to a target(like a controller or a method).

// You would use this decorator to "tag" a route with the roles required to access it.A Guard(like a RolesGuard) would then read this metadata to determine if the authenticated user has the necessary permissions.
