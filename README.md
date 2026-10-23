# ACES Knowledge Base

A Next.js + Contentful site. The `create-site` command sets up a Contentful space with this project's content model and seed content (pages, navigation, and the placeholder resources).

## Prerequisites

- **Node.js 20.5.1 or newer**
- **An empty Contentful space.** Use a new space, or an empty environment in an existing one. Importing into a space that already has content can cause conflicts.
- **Three Contentful tokens:**
  | Token | Where to get it |
  | --- | --- |
  | Space ID, Content Delivery API token, Content Preview API token | Contentful → **Settings → API keys → Add API key** |
  | Content Management API (CMA) token | Contentful → **Settings → CMA tokens → Create personal access token** |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run `create-site`

```bash
npm run create-site
```

It asks for your Space ID, environment (default `master`), the three tokens, and an optional GTM ID. Then it:

1. Writes your `.env` file, overwriting any existing one
2. Imports the content model (`npm run import-models-only`)
3. Imports the seed content and assets (`npm run import-content`)
4. Sets up Live Preview (`npm run create-previews`)

### 3. Check the preview secret in `.env`

`create-site` generates a random value for `NEXT_PUBLIC_CF_PREVIEW_SECRET` and adds it to `.env`. The draft/preview routes check this secret. To use your own value instead, set it in `.env`:

```bash
NEXT_PUBLIC_CF_PREVIEW_SECRET=some-long-random-string
```

Then re-run the Live Preview setup so Contentful uses the new secret:

```bash
npm run create-previews
```

### 4. Start the site

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live Preview

`create-previews` creates (or updates) a Contentful preview environment named **ACES Live Preview**. It points at `NEXT_PUBLIC_SITE_URL` and uses `NEXT_PUBLIC_CF_PREVIEW_SECRET`. Re-run it whenever you change either value, for example after deploying:

```bash
# in .env
NEXT_PUBLIC_SITE_URL=https://your-deployed-site.example.com

npm run create-previews
```

Running it again is safe. It updates the existing preview environment instead of creating a duplicate.

## Environment variables

See `.env.example`. `create-site` fills in all of these for you.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CF_SPACE` | Contentful space ID |
| `NEXT_PUBLIC_CF_ENVIRONMENT` | Contentful environment (e.g. `master`) |
| `NEXT_PUBLIC_CF_ACCESS_TOKEN` | Content Delivery API token |
| `NEXT_PUBLIC_CF_PREVIEW_ACCESS_TOKEN` | Content Preview API token |
| `NEXT_CF_MANAGEMENT_TOKEN` | CMA token (used only by the scripts in `commands/`) |
| `NEXT_PUBLIC_CF_PREVIEW_SECRET` | Shared secret for the `/api/draft/*` preview routes |
| `NEXT_PUBLIC_SITE_URL` | Base URL of the site, used for Live Preview URLs |
| `NEXT_PUBLIC_CF_GRAPHQL_URL` | Contentful GraphQL endpoint |
| `NEXT_PUBLIC_CF_APP_ID` | App identifier |
| `NEXT_PUBLIC_CF_GTM_ID` | Google Tag Manager ID (optional) |

## Other commands

| Command | What it does |
| --- | --- |
| `npm run export-content` | Exports content from your space to `commands/json/content-export.json` (the seed `create-site` imports) |
| `npm run export-models-only` | Exports the content model to `commands/json/models-export.json` |
| `npm run import-content` / `import-models-only` | Imports those files into the space in `.env` |
| `npm run create-cf-component` | Scaffolds a new Contentful-backed component |
| `npm run storybook` | Runs Storybook on port 6006 |

If you change content or models in your own space and want new setups to get those changes, run both export commands and commit the updated JSON files.
