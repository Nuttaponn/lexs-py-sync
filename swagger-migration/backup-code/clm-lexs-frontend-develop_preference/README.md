# Lexs

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Required Library: @spig/core

It requires Angular library named '@spig/core' which is reside in `/projects/spig-core`. Configured as one of `paths` variables of `compilerOptions` section in `/tsconfig.app.json`

## Development server

Move to workspace root directory and run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Running OpenAPI client generator

1. Relocate path to `/projects/client-codegen`.
2. Run `sh update-clients.sh`

| Syntax                                | Description                       |
| ------------------------------------- | --------------------------------- |
| `sh update-clients.sh all`            | Update all API clients on LEXS.   |
| `sh update-clients.sh <spacific API>` | Update specific input API client. |

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
