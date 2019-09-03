# User Auth Api

A simple implementation of an auth api using _ts.ed_, _bcrypt_, _jest_ and _typescript_.

## Setting up the project

1. Clone the repo `git clone git@github.com:Baboo7/User-Auth-Api.git`
1. Install dependencies `npm i`
1. Create a `.env` file with the variables:

```
LOG_LEVEL=debug
NODE_ENV=development
PORT=8500
SECRET_KEY=s3cr3tp4ssw0rd
SECRET_KEY_TOKEN=s3cr3tp4ssw0rd
```

4. Run the project `npm run dev`

## Usage

A swagger is accessible at `http://localhost:8500/swagger`.

To authenticate, use the route `/api/users/login` with either

```
// User
{
  "email": "user@example.com",
  "password": "soleil123"
}
```

or

```
// Admin
{
  "email": "admin@example.com",
  "password": "admin"
}
```

This will send you a token you can copy paste.

To retrieve the list of all users, use the route `/api/users`. You will need an admin token and fill in the `Authorization` field with `Bearer <ADMIN_TOKEN>`.

## Structure

`/api`: contains the controllers, services, middlewares and dtos for the api.

`/database`: contains the models and repositories to interact with the database. The table of users is mocked in the `UserRepository`.

`/types`: contains the types used accrosed the app.

## Testing

Test can be found in the `tests` folder at the root of the project.

Run the tests with `npm t`
