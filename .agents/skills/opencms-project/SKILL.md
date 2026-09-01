---
name: opencms-project
description: Build a Next.js website on top of OpenCMS by choosing the right project files and CLI command for schemas, content, local development, and deployment.
---

# Building on OpenCMS

Use this skill when creating or changing a website that gets its content from OpenCMS.

The goal is a normal Next.js application with a content model managed in code and content managed in OpenCMS. Keep the website presentation in app/ and the OpenCMS integration in cms/.


## Project shape

An OpenCMS website has this shape:

    project/
    ├── app/                  # Next.js routes and presentation
    ├── cms/
    │   ├── schema.json       # Content model: blocks and content types
    │   ├── client.ts         # Reads published OpenCMS content
    │   ├── opencms.ts        # Project connection settings
    │   └── page-renderer.tsx # Turns content blocks into React UI
    └── .env.local            # Project connection values; never commit

The starter uses / for the home page and /[slug] for other pages. Keep that convention unless the product needs a different routing model.

## Decide where a change belongs

First classify the request:

| Request | Change |
| --- | --- |
| Change layout, styling, navigation, or page behavior | app/ and normal Next.js components |
| Add a reusable content block | cms/schema.json and cms/page-renderer.tsx |
| Add a content type | cms/schema.json, then add the UI needed to render it |
| Change page title, slug, or block values | OpenCMS dashboard, not source code |
| Change project/environment connection | .env.local, not a hardcoded URL |
| Make schema changes available in the cloud | OpenCMS CLI |

Do not put dashboard-entered content in source files. Source code describes the shape and presentation; the dashboard contains the actual page data.

## Define content

cms/schema.json is the single content-model format. Use JSON;
A block should have:

- a stable machine name, such as hero or feature-list;
- a human-readable label;
- fields with the supported field types;
- a renderer in cms/page-renderer.tsx.

When adding a block, update both the schema and renderer. A schema entry without a renderer can be saved in OpenCMS but cannot be displayed by the website.

The current supported field types are text, slug, number, and boolean. Use the existing schema version and preserve existing blocks unless a breaking change is intentional.

## Use the commands at the right time

### dev

Run this from the generated project:

    npx @maker-or/opencms dev

It synchronizes cms/schema.json with the development environment and starts the local Next.js server. Run it after changing the schema and when checking the website against development content.

It does not create pages. Create pages and enter their content in the OpenCMS dashboard.

Use this command instead of starting a second server with npm run dev or bun dev. Running both can cause port conflicts and can skip schema synchronization.

### deploy

When development content and schema are ready:

    npx @maker-or/opencms deploy

This synchronizes the schema and promotes development content to production. The deploy action belongs to the CLI; do not add a deploy button to the website.

### login and logout

    npx @maker-or/opencms login
    npx @maker-or/opencms logout

Use login when a CLI command reports an expired or missing session. logout removes the local CLI session.

## What appears on the website

The starter reads published pages for the configured environment. A schema alone does not create a page, and a draft page does not appear in the website.

If the website is empty:

1. Confirm the project ID and API URL in .env.local.
2. Create a page in the OpenCMS dashboard.
3. Give it the expected slug, usually home for /.
4. Add blocks whose types exist in cms/schema.json.
5. Publish the page in the current environment.
6. Refresh the website.

If a schema edit is not visible in OpenCMS, run npx @maker-or/opencms dev again. If production is missing the latest development content, run npx @maker-or/opencms deploy.

## Connection settings

The generated project uses:

    NEXT_PUBLIC_OPENCMS_PROJECT_ID=...
    OPENCMS_API_URL=https://your-opencms-domain.example
    OPENCMS_ENVIRONMENT=development

The CLI normally writes these values. Never commit .env.local, hardcode a personal project ID, or add credentials to client-side code.

For an existing project, a localhost:3000 API URL usually means it was generated with an older CLI. Update it to the current OpenCMS API URL or regenerate the project with the CLI.

## Validation

After changing the website or content integration, run:

    npm run typecheck
    npm run lint
    npm run build

Then use npx @maker-or/opencms dev for the end-to-end check. Confirm that the schema sync completes, the local site starts, and a published home page renders at /.
