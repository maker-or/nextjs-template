---
name: opencms-project
description: Build and maintain a Next.js website connected to OpenCMS, including content modeling, rendering, local development, and deployment.
---

# Build on OpenCMS

Use this skill when creating or changing a Next.js website connected to OpenCMS.

The application has two separate sources of truth:

- Website code lives in the Next.js project.
- Page data lives in the OpenCMS project and environment.

Do not treat a Next.js route as an OpenCMS page. They are different things.

## The important distinction

There are two meanings of “page” in this workflow:

- `app/page.tsx` or `app/[slug]/page.tsx` is a Next.js route. It defines how the website renders.
- An OpenCMS page is a cloud document/entry with a title, slug, status, environment, and block content.

Creating or editing a file under `app/` never creates an OpenCMS page. Creating or editing `cms/schema.json` also never creates an OpenCMS page.

The current template reads published OpenCMS content through the delivery API. It does not contain a management token and it has no command for creating page records. Unless an authenticated OpenCMS management API or supported CLI content command is explicitly available, do not claim that a page or content was created in the cloud.

## Project shape

Keep the generated project organized like this:

    project/
    ├── app/                  # Next.js routes, UI, and presentation
    ├── cms/
    │   ├── schema.json       # Developer-owned content model
    │   ├── client.ts         # Read-only delivery client
    │   ├── opencms.ts        # Project connection settings
    │   └── page-renderer.tsx # Maps CMS blocks to React UI
    └── .env.local            # Local connection values; never commit

The default route convention is `/` for the `home` slug and `/[slug]` for other published pages.

## Decide where a change belongs

| Request | Change |
| --- | --- |
| Change layout, styling, navigation, or interaction | `app/` and normal Next.js components |
| Add a reusable CMS block | `cms/schema.json` and `cms/page-renderer.tsx` |
| Add a content type | `cms/schema.json` and the renderer/UI needed for it |
| Change title, slug, status, environment, or block values | OpenCMS dashboard or an explicitly supported authenticated content command |
| Change project connection | `.env.local` |
| Make a schema available in the cloud | `npx @maker-or/opencms dev` or `deploy` |

Source code describes the content shape and presentation. OpenCMS stores the actual content values.

## Define the content model

`cms/schema.json` is the single content-model format. Use JSON, not Markdown, GraphQL, or a second parallel schema.

Each block needs:

- a stable machine name, such as `hero` or `feature-list`;
- a human-readable label;
- fields using the supported field types: `text`, `slug`, `number`, or `boolean`;
- a matching renderer in `cms/page-renderer.tsx`.

When adding a block, update both the schema and renderer. A schema entry without a renderer can be saved in OpenCMS but will not display correctly.

Preserve the existing schema version and blocks unless a breaking change is intentional.

## Creating actual CMS pages

The current supported content workflow is:

1. Define or update the schema in `cms/schema.json`.
2. Run the CLI so the schema is synchronized.
3. Create an OpenCMS page in the dashboard development environment.
4. Give it a slug, normally `home` for `/`.
5. Add blocks whose types exist in the schema.
6. Publish the page.
7. Load the website and verify that the delivery API returns it.

An AI coding agent may create the Next.js route, schema, and renderer, but it must not imply that this created the cloud page. If it does not have an authorized management operation for page creation, it must clearly report:

- what was created locally;
- whether the schema was synchronized;
- whether a cloud page was found;
- the dashboard action still required from the user.

Do not silently replace missing CMS content with production-looking hard-coded content. If a page is missing, render the starter empty state or a clearly labeled development preview only when the user explicitly requests a preview.

## Use the commands at the right time

### `dev`

Run from the generated project:

    npx @maker-or/opencms dev

The template's `dev` package script is the same workflow, so `npm run dev`, `pnpm dev`, `yarn dev`, and `bun run dev` are also supported. They invoke the CLI, which synchronizes the schema before starting Next.js. Use one of these commands, not both.

This synchronizes `cms/schema.json` with the development environment and starts the local Next.js server. It does not create page records, enter block values, or publish content.

Use this after schema changes and when checking the website against development content. `dev:next` is an internal template script for the CLI; it starts only Next.js and must not be used as a replacement for the OpenCMS development command.

### `deploy`

When development schema and content are ready:

    npx @maker-or/opencms deploy

This synchronizes the development schema, then promotes that schema and the published development pages as one production snapshot. Drafts remain private, stale production pages are removed, and production schema/content are read-only in the dashboard. Deployment belongs to the CLI; do not add a deployment button to the website.

### `login` and `logout`

    npx @maker-or/opencms login
    npx @maker-or/opencms logout

Use `login` when the CLI reports a missing or expired session. These commands authenticate the CLI, not the generated website.

## What appears on the website

The delivery API returns only pages with `published` status in the configured environment. Therefore:

- a schema alone produces no page;
- a draft page does not appear;
- a page in production does not appear when the site is configured for development;
- a page with unsupported block types may load without the intended UI.

Create, edit, publish, unpublish, and delete pages in development. Treat production as a deployed snapshot; do not attempt to mutate production pages directly.

When the website is empty, check the following in order:

1. `.env.local` has the correct project ID, API URL, and environment.
2. `cms/schema.json` has been synchronized with `npx @maker-or/opencms dev`.
3. A page exists in the same OpenCMS project and environment.
4. Its slug is `home` for `/`, or matches the requested route.
5. Its status is `published`.
6. Its block types have renderers.

If the site still appears empty, report the API response and the missing condition instead of inventing content in source code.

## Connection settings

The generated project uses:

    NEXT_PUBLIC_OPENCMS_PROJECT_ID=...
    OPENCMS_API_URL=https://your-opencms-domain.example
    OPENCMS_ENVIRONMENT=development

The CLI normally writes these values. Never commit `.env.local`, hard-code a personal project ID, add Clerk credentials to the template, or put a management token in browser code.

For the CLI itself, configure the control-plane origin with `OPENCMS_URL`. It may point to a hosted OpenCMS deployment, a local instance, or a self-hosted instance. Do not hard-code a Vercel preview URL or assume that every OpenCMS installation uses the same host. `OPENCMS_API_URL` and `OPENCMS_DASHBOARD_URL` are compatibility overrides for deployments where the API and dashboard use different origins.

## Validation and completion report

After changing the website or integration, run:

    npm run typecheck
    npm run lint
    npm run build

Then run:

    npx @maker-or/opencms dev

Before saying the work is complete, distinguish the results:

- local code changed;
- schema synchronized;
- cloud page exists;
- cloud page is published;
- published page renders at the expected route.

Never use “synced” to mean that page content was created unless a page mutation was actually performed and verified.
