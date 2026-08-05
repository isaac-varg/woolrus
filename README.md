# Woolrus
Woolrus streamlines WooCommerce order fulfillment by providing warehouse staff with the ability to pick, pack, QA and generate shipping labels all in one place. 

# Dependencies

- WooCommerce
- [WPGraphQL](https://www.wpgraphql.com)
- [WooGraphQL](https://woographql.com)
- [WooGraphQL Pro](https://woographql.com)

# Getting Started

## With Docker (recommended)

`compose.yml` brings up the whole environment: Woolrus, Postgres, [rustfs](https://rustfs.com)
for object storage, and a WordPress/WooCommerce instance with the GraphQL plugins
already installed.

```bash
cp .env.example .env
docker compose up -d          # infrastructure only
docker compose logs wp-init   # prints the WordPress application password
```

Copy the printed `WP_GRAPHQL_KEY` / `WP_GRAPHQL_SECRET` into `.env`, then either
run the app on the host:

```bash
pnpm install
pnpm run prisma:migrate
pnpm run dev                  # http://localhost:3000
```

...or run everything in containers:

```bash
docker compose --profile full up --build
```

| Service   | URL                     |
| --------- | ----------------------- |
| Woolrus   | http://localhost:3000   |
| WordPress | http://localhost:8080   |
| rustfs console | http://localhost:9001 |

### Three things compose cannot do for you

1. **Discord OAuth.** It is the only sign-in provider, and there is no local
   bypass. Register an app at the
   [Discord developer portal](https://discord.com/developers/applications) with
   redirect URI `http://localhost:3000/api/auth/callback/discord`, then set
   `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET`. Also set `AUTH_SECRET`
   (`openssl rand -base64 32`).
2. **WooGraphQL Pro** is a paid plugin and cannot be downloaded unattended. Drop
   the zip into `./wp-plugins/` and re-run `docker compose up wp-init`, which
   installs and activates everything it finds there. Features depending on Pro
   will not work until you do.
3. **The application password** must be copied from the `wp-init` output into
   `.env` by hand, since it is only shown once.

### Building the image on its own

```bash
docker build -t woolrus .
```

The `Dockerfile` has two useful targets: `runner` (default — slim standalone
Next.js server) and `migrator`, which carries the Prisma CLI and runs
`prisma migrate deploy`.

## Without Docker

- Ensure dependencies installed on your Wordpress
- `cp .env.example .env` and fill it in
- `pnpm install`
- `pnpm run prisma:migrate`
- `pnpm run dev`

# Development Scripts 

```bash
pnpm run sync:pull
```
- performs a manual sync from woocommerce to woolrus

```bash
pnpm run prisma:migrate
```
- performs prisma dev migration

```bash
pnpm run prisma:generate
```
- generates prisma client

```bash
pnpm run sync:reset
```
- deletes all data except boxes.
- great way to reset data during development
