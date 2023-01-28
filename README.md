## Installation

```bash
$ git clone https://github.com/ginoburdea/scheduling-app-client.git
$ cd scheduling-app-client
$ npm install
```

## Running the app

```bash
# development mode
$ npm run dev

# build for production
$ npm run build

# preview the production build
$ npm run preview
```

## Testing

```bash
# open cypress to run tests
$ npm run test

# run tests in ci mode
$ npm run test:ci
```

## Generating types based on the server's OpenAPI schema

```bash
# Make sure the server is running, then run
$ npx openapi-typescript <ServerURL>/docs-json --output src/utils/apiSchema.ts

# Example
$ npx openapi-typescript http://localhost:12345/docs-json --output src/utils/apiSchema.ts
```
