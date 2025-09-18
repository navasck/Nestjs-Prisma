<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## @nestjs/common 📦

This package contains the most commonly used, fundamental building blocks for creating a NestJS application. You'll import from here for almost every component you create.

```bash

  # Decorators:

  @Module(): Defines a NestJS module.

  @Injectable(): Marks a class as a provider that can be managed by the NestJS IoC container.

  @Controller(): Defines a class as a controller, handling incoming requests.

  @Get(), @Post(), @Put(), @Delete(), etc.: Route-handling decorators for HTTP requests.

  @Inject(): Manually injects a provider.

  # Interfaces:

  OnModuleInit, OnModuleDestroy, OnApplicationBootstrap: Lifecycle hooks for modules and applications.

  CanActivate: Used for creating a Guard.

  NestInterceptor: Used for creating an Interceptor.

  PipeTransform: Used for creating a Pipe.


  # Exceptions and Utilities:

  HttpException: A base class for custom HTTP-based exceptions.

  HttpStatus: An enum for standard HTTP status codes.


```

## @nestjs/core 🧠

This package contains the core runtime and bootstrapping functionalities. You will use it less frequently in your day-to-day coding, but it is essential for the application's structure and advanced features.


```bash

   # Core Classes:

   NestFactory: The main class for creating an application instance. You use its create() method to bootstrap the application in main.ts.

   NestApplication: The class returned by NestFactory.create(), representing the running application.

   Reflector: A service for reading metadata attached to classes and methods (e.g., from custom decorators). It's crucial for implementing Guards and Interceptors.


   # Pipes & Guards:


   APP_PIPE & APP_GUARD: Tokens used to register global pipes and guards.


   # Exceptions and Error Handling:

   HttpExceptionFilter: A base class for creating custom exception filters.


```

