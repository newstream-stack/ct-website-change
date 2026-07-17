# Frontend security notes

## Implemented

- Vite bundle contains no Gemini key or backend secret.
- Production REST mode requires an HTTPS `VITE_API_BASE_URL`.
- Production defaults to REST mode, so a missing environment setting cannot silently publish mock authentication or transactions.
- Authentication tokens use per-tab `sessionStorage`; logout is broadcast without sharing tokens.
- Article HTML is sanitized with DOMPurify.
- Payment results are verified through the backend status endpoint; URL query values never determine success.
- Payment and advertising redirects only allow HTTP(S) URLs.
- CSP and strict referrer policy are defined in `index.html`.
- Critical authentication, member, news, product, order and payment responses receive runtime shape checks.
- Server errors do not expose backend response details to the UI.
- Authenticated and payment-status requests disable browser caching.

## Required deployment headers

The hosting platform should additionally send these HTTP headers. `frame-ancestors` and HSTS cannot be reliably enforced with HTML meta tags.

```text
Content-Security-Policy: use the policy from index.html, narrow connect-src to the production API origin, and add frame-ancestors 'none'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
Referrer-Policy: strict-origin-when-cross-origin
```

Never place private API keys in variables prefixed with `VITE_`; those values are bundled into browser JavaScript.

## Backend release blockers

These items cannot be enforced by the SPA and must be completed before production transactions are enabled.

- Authorize every `/api/me` resource and every order, donation, receipt and payment reference against the authenticated owner. Never rely on hidden buttons or frontend route guards.
- Verify payment webhook signatures, timestamps and event IDs; reject replayed events and update transaction state atomically.
- Enforce `Idempotency-Key` on orders, memberships, donations and event registrations, including concurrent requests.
- Rate-limit login, registration, forgot-password, payment-status and transaction creation endpoints. Add progressive delay or account protection without revealing whether an email exists.
- Recalculate prices, discounts, shipping, donation constraints and event capacity on the server. Treat all frontend numbers and IDs as untrusted.
- If authentication uses cookies, require `Secure`, `HttpOnly` and an appropriate `SameSite` policy, plus CSRF tokens for state-changing requests. Rotate refresh tokens and detect reuse.
- Use an exact CORS origin allowlist. Do not combine credentialed requests with `Access-Control-Allow-Origin: *`.
- Validate request schemas, normalize emails and phone numbers, bound string/array sizes and reject unexpected fields at the API boundary.
- Mask tokens, passwords, card data, addresses and donor details in logs and error monitoring. Define retention and deletion rules for personal data and receipts.
- Keep secrets in the hosting platform's secret manager, rotate them, and separate development, staging and production credentials.

## Pre-release verification

- Run dependency audit, automated tests and production build from a clean CI environment.
- Test horizontal authorization (IDOR) with two different accounts.
- Test webhook replay, duplicate-submit races, expired sessions and payment return URLs with forged query parameters.
- Confirm CSP, HSTS, CORS, cookies and cache headers from the deployed response, not only from local HTML.
- Add monitoring for authentication spikes, repeated payment failures, webhook signature failures and unusual status lookups without logging personal data.
- Arrange database backups and a tested restore procedure before accepting real orders or donations.
