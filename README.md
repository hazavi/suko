# Suko

Simple Angular + Firebase storefront.

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   ng serve
   ```
   Open http://localhost:4200

## Build
```bash
ng build
```
Outputs production bundle in `dist/`.


## Tech
- Angular 20
- Firebase (Auth, Database/Storage as configured)
- SCSS styling

## Structure (high level)
```
src/
  app/                feature + layout components
  services/           data + utility services
  environments/       local (git-ignored) env files
  assets/             images & product assets
```
