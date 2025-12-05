# Docs

This is the documentation for [AI Elements Vue](https://github.com/vuepont/ai-elements-vue).

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3002

```bash
pnpm dev
```

## Production

Build a fully static version of the docs (outputs to `.output/public`):

```bash
pnpm build
```

Preview the generated site with Cloudflare Pages tooling:

```bash
# run after pnpm build
pnpm preview
```

Deploy to Cloudflare Pages (requires `wrangler login` once):

```bash
# from apps/www
pnpm run deploy
```
