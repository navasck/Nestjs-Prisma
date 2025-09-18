import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// this is a decorator that marks a route as public, bypassing authentication.
// You would use this decorator on controller methods that you want to be accessible without authentication, such as login or registration endpoints.

// custom decorator

// A custom decorator in NestJS is a TypeScript function that allows you to add metadata to classes, methods, or parameters. This metadata can then be read and used by other NestJS components like Guards, Interceptors, or Pipes to execute custom logic. They are a powerful tool for creating declarative, reusable, and type-safe code.
