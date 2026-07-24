# Operations guide

## Deployment

1. Complete every blocking item in `LAUNCH_CHECKLIST.md`.
2. Set production environment values through Sites; never commit `.env` files.
3. Confirm the logical D1 and R2 bindings in `.openai/hosting.json` resolve to the intended production resources.
4. Apply and verify the checked-in Drizzle migration.
5. Remove fictional sample data.
6. Add the first allowlisted administrator and test server-side denial with a non-allowlisted account.
7. Configure the verified email sender and recipient, then submit a real end-to-end test enquiry.
8. Add approved genuine inventory and authorised photographs.
9. Run type checking, lint, tests, production build, desktop/mobile QA and broken-link checks.
10. Deploy privately for stakeholder approval before public access.

## Domain and DNS checklist

- Confirm the approved domain and registrar owner.
- Add the platform-provided DNS records exactly; do not guess CNAME targets.
- Set `PUBLIC_SITE_URL` to the HTTPS canonical origin.
- Redirect alternate hostnames and HTTP to the canonical HTTPS origin.
- Confirm SSL issuance, renewal and HSTS suitability.
- Verify sitemap and robots output on the production hostname.
- Confirm Open Graph previews use `/og.png` and canonical URLs are correct.
- Configure SPF, DKIM and DMARC for the email-sending domain.

## Backups and recovery

- Enable scheduled D1 backups or exports according to the hosting plan.
- Record R2 object lifecycle and versioning settings.
- Keep migration files in source control and back up environment configuration separately in an approved secrets manager.
- Quarterly, restore a database export into an isolated test environment and verify vehicles, images, enquiries, notes and audit logs.
- Recovery order: create isolated resources, apply migrations, restore D1, restore/attach R2, verify access controls, test enquiry storage, then switch traffic.
- Never test restores against the live database.

## Security notes

- Admin authentication uses platform-owned sign-in plus a server-side allowlist and active-user mapping.
- Every write endpoint authorises independently.
- Uploaded file names are ignored; generated keys are used. SVG and unknown MIME types are rejected.
- Public image responses require an image to belong to a published, unarchived vehicle.
- Rate-limit keys are one-way hashes of network identifiers; raw addresses are not stored in the rate-limit table.
- CSP, framing, MIME-sniffing, referrer and permissions headers are added by the worker.
- Review dependency advisories monthly and before every release.
- Rotate email, storage and authentication secrets after any suspected exposure.

## Content maintenance

- Review availability daily while stock is advertised.
- Confirm price basis and all technical claims against approved source data.
- Mark sold vehicles promptly; default public browsing excludes sold records.
- Review failed/not-configured notification statuses every business day.
- Audit admin access quarterly and deactivate leavers immediately.
- Review privacy, terms, licence and warranty wording whenever operations or law change.

## Incident response

1. Preserve relevant audit events and provider logs without copying full customer messages into tickets.
2. Restrict affected credentials or accounts.
3. If enquiry email fails, use the stored administration record for follow-up.
4. If inventory becomes misleading, unpublish the affected records immediately.
5. Assess privacy, consumer-law and breach-notification obligations with qualified advisers.

## Post-launch maintenance checklist

- Weekly: stock accuracy, failed enquiry notifications, broken media and 404 trends.
- Monthly: dependency/security review, admin access review and sample-data check.
- Quarterly: restore test, accessibility spot check, Core Web Vitals review, contact/licence detail review.
- Annually or on material change: legal/privacy review, data-retention review and SCD Direct relationship approval.
