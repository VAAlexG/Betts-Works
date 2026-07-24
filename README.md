# Betts Works website

A production-oriented MVP for Betts Works, an independent Australian dealer of American trucks and selected vehicles. The site clearly separates Betts Works’ dealer role from SCD Direct’s sourcing, importation, right-hand-drive conversion and compliance role.

> Launch status: the software MVP and current SCD Direct inventory integration are implemented, but the website must not be treated as production-ready until the remaining business, legal, contact, licence and provider approvals in `LAUNCH_CHECKLIST.md` are complete.

## What is included

- Public pages: home, current stock, vehicle detail, about, SCD Direct and conversion, FAQ, contact, draft privacy policy, draft terms and 404.
- Database-backed current SCD Direct inventory with the exact vehicle details and authorised source photography supplied for Betts Works.
- Search, filter, sort, URL query parameters, progressive loading and empty states.
- Vehicle-specific SEO metadata, JSON-LD, sitemap, robots rules, breadcrumbs and slug redirects.
- Enquiries with client/server validation, honeypot, durable rate limiting, optional Turnstile, database-first storage, email notifications and failure states.
- Protected administration with a server-side email allowlist, inventory lifecycle actions, image upload/reordering, enquiry statuses, notes and audit records.
- Cloudflare D1 relational data and R2 image storage through the Sites runtime.
- Responsive, keyboard-friendly interface with reduced-motion support, visible focus states and high-contrast controls.
- Security headers, no-index admin responses, safe upload types, generated storage keys and no browser-exposed secrets.

## Architecture

The application uses Next.js App Router semantics through Vinext, React, strict TypeScript, Tailwind CSS, Drizzle ORM, Cloudflare D1 and R2. Public and admin pages consume a data-access layer in `lib/data.ts`; UI components do not access storage providers directly. D1 is used because this repository is configured for Sites hosting. The schema is relational and the DAL boundary allows a later PostgreSQL/Supabase adapter without redesigning the UI.

Key areas:

- `app/` — routes, layouts, forms and protected admin UI.
- `lib/` — validation, data access, authorisation, email and editable site configuration.
- `db/schema.ts` — relational schema.
- `drizzle/` — generated migration checked into source control.
- `worker/index.ts` — deployment entry point and security headers.
- `.openai/hosting.json` — logical D1 (`DB`) and R2 (`VEHICLE_IMAGES`) bindings.

## Local setup

1. Install Node.js 22.13 or newer.
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` and set only local values.
4. Set `DEV_ADMIN_EMAIL` and include the same email in `ADMIN_EMAILS` to access admin locally. The development bypass is ignored in production.
5. Run `npm run dev` and open the printed local URL.

The first development inventory request creates the local schema and synchronises the captured SCD Direct inventory in `db/scd-inventory.json`. The normaliser in `db/scd-inventory.ts` preserves the source identifiers and listing URLs while adapting the records to the Betts Works data model.

## Environment variables

See `.env.example` for the complete safe template.

- `PUBLIC_SITE_URL` — canonical production origin.
- `ADMIN_EMAILS` — comma-separated server-side administrator allowlist.
- `DEV_ADMIN_EMAIL` — local-only identity; never use as production authentication.
- `EMAIL_API_KEY`, `EMAIL_FROM`, `SALES_NOTIFICATION_EMAIL` — optional Resend-compatible email delivery.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` — optional Cloudflare Turnstile.
- `NEXT_PUBLIC_ANALYTICS_ENABLED`, `ANALYTICS_PROVIDER` — analytics remains disabled by default.

When email is absent, enquiries are still saved with `notification_status = not_configured`. When Turnstile is absent, the honeypot and database rate limit remain active. The public site remains usable without optional services.

## Database and migrations

Run `npm run db:generate` after schema changes. Inspect the generated SQL before committing. Sites packages migrations from `drizzle/` during deployment. Local development also runs idempotent `CREATE TABLE IF NOT EXISTS` statements so the preview works without a separate migration step.

The production migration seeds the captured SCD Direct stock. Development synchronisation archives legacy fictional sample rows and refreshes the `scd-*` records from the checked-in capture. Before release, compare the capture with the live SCD Direct inventory and update availability or pricing where necessary.

## Admin-user setup

There is no public registration. Production administrators must:

1. Sign in through the platform-owned ChatGPT sign-in flow.
2. Have an email present in `ADMIN_EMAILS`.
3. Be active in `admin_users`.

The first allowlisted sign-in creates an owner mapping. Every admin page and mutation repeats authorisation on the server. Hiding UI controls is never relied upon for security.

## Inventory guide for staff

1. Open Administration and choose **Create vehicle**.
2. Save a draft first. Use only verified specifications; never infer towing, power or compliance from the model name.
3. Add approved JPEG, PNG, WebP or AVIF photography up to 10 MB per image. Write alt text describing the exact vehicle and view.
4. Reorder images; the first image becomes primary.
5. Preview the public page, confirm price basis and availability, then publish.
6. Use **Under offer** or **Sold** as circumstances change. Sold records disappear from default stock results.
7. Use **Archive** instead of permanent deletion. Slug changes create redirects automatically.

The SCD inventory import is source-controlled for reproducibility. Re-capture and review the source feed before replacing `db/scd-inventory.json`; do not infer missing specifications.

## Enquiry operations

Valid enquiries are saved before notification email is attempted. Administrators should monitor notification status:

- `sent` — sales notification accepted by the provider.
- `not_configured` — storage succeeded; email is not configured.
- `failed` — storage succeeded; email delivery failed and requires follow-up.

Internal notes and audit events are available only to authorised administrators and are not returned by public endpoints.

## Image preparation

- Use authorised photographs of the actual listed vehicle.
- Recommended source: 3:2 or 16:10, at least 1600 px wide, sRGB, under 10 MB.
- Keep number plates, people, premises and private details out unless approved.
- Do not upload SVG, manufacturer marketing images without permission, or generated imagery as actual inventory. Current stock photography is linked to the supplied SCD Direct source feed under the permission provided for this implementation.
- Brand artwork in `public/brand/` is extracted directly from the supplied Betts Works V2 brand-kit PDF so the approved hexagon proportions are preserved. Replace these dark-background PNG exports only when original transparent production files are supplied.

## Brand system

- Display: Anton. Interface labels and navigation: Barlow Condensed. Body: Barlow. Yellowtail is reserved for rare decorative accents.
- Core palette: Asphalt Black `#0A0A0C`, Panel Charcoal `#17171C`, Betts Red `#C8102E`, Union Blue `#1F3B73`, Chrome Silver `#C9CCD3`, Trophy Gold `#C9A24B`, Headlight White `#F5F6F8`.
- Brand-kit sample contact details and promotional phrases are not treated as verified business facts. The configurable site details and the dealer/provider role separation remain the source of truth.

## Email configuration

The integration uses a Resend-compatible HTTPS API. Configure a verified sender domain, set the server-only API key, sales recipient and sender. Test both successful delivery and a forced provider failure before launch. No credentials or full enquiry messages are logged to browser/public logs.

## Privacy-conscious analytics

Analytics is disabled. If enabled later, document the provider, consent basis, retention and data locations. Only aggregate events such as vehicle viewed, enquiry started/submitted and phone-link clicks should be emitted. Never include form contents, names, emails, phone numbers, VINs or stock notes.

## Verification commands

- `npx tsc --noEmit` — strict type checking.
- `npm run lint` — lint and accessibility-oriented static rules.
- `npm test` — validation, migration/database tests and rendered application checks.
- `npm run build` — production deployment bundle.

## Deployment, domain, backup and maintenance

See `docs/OPERATIONS.md` for the complete deployment, DNS, backup/recovery, security and post-launch workflow.
