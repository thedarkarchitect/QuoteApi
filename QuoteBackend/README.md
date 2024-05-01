# QuoteApi BACKEND

This is a simple quoteApi backend

## Install Dependancies

```npm install```

## Setup env variables in a .env file and install dontenv

```PORT = 3030
DATABASE_URL = `postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_NAME}?schema=public`
JWT_SECRET_ACCESS = {generate a secret key}
```

## Setup prisma

```npx prisma migrate dev --name {NAME MIGRATION}```

## Running the server

```npm run start```
