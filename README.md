# Woolrus
Woolrus streamlines WooCommerce order fulfillment by providing warehouse staff with the ability to pick, pack, QA and generate shipping labels all in one place. 

# Dependencies

- WooCommerce
- [WPGraphQL](https://www.wpgraphql.com)
- [WooGraphQL](https://woographql.com)
- [WooGraphQL Pro](https://woographql.com)

# Getting Started

- Ensure dependencies installed on your Wordpress
- `pnpm install`
- `pnpm run dev`

Docker image coming. 

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
