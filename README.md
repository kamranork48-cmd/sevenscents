# Seven Scents

An editorial fragrance storefront for the Seven Scents brand. The workspace contains a Next.js storefront and a separate Medusa v2 backend/admin scaffold.

## Current state

- The storefront runs from a local seed catalog of ten original fragrance concepts, each with 30 ml, 50 ml, and 100 ml variants, individual PKR prices, and stock quantities.
- Search, note-family filters, a persistent shopping bag, COD delivery details, and the catalog-based scent concierge work in the storefront.
- Without `OPENAI_API_KEY`, the concierge uses a deterministic catalog fallback. No customer personal information is sent to the model.
- Without a connected commerce service, checkout creates a clearly labelled local order preview only. It does not accept, save, or fulfill an order and must not be used for live sales.
- Medusa is scaffolded under `commerce/`, but its dependencies have not been installed and no PostgreSQL database is configured. Admin, live inventory, real COD order creation, and courier booking are not operational yet.
- The logo was not present in the workspace when the storefront was created. The current typographic wordmark and Pexels photography are temporary art direction; replace them with approved Seven Scents identity and owned/licensed product photography before launch.

## Stack

- Next.js App Router, React, TypeScript, and Tailwind CSS 4
- CSS-variable brand tokens; Cormorant Garamond display type and DM Sans interface type
- Motion for UI transitions, GSAP ScrollTrigger loaded lazily for one editorial reveal
- Medusa v2 for the intended commerce engine and admin dashboard
- PostgreSQL required for local Medusa operation
- COD is the only intended launch payment method. Courier integrations belong in Medusa fulfillment-provider adapters; payment methods belong in payment-provider adapters.

## Run the storefront

Prerequisite: Node.js 22.12 or newer (the workspace was checked with Node 22.23.3).

In PowerShell from the workspace root:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Build and check the source with:

```powershell
npm run lint
npm run typecheck
npm run build
```

If PowerShell cannot find Node immediately after installation, open a new terminal so its PATH refreshes.

## Medusa backend and admin

The generated Medusa project is in `commerce/`. PostgreSQL is a prerequisite; the scaffold command skipped database setup. After PostgreSQL is running and a database is created, copy `commerce/apps/backend/.env.template` to `commerce/apps/backend/.env`, use a strong unique `JWT_SECRET` and `COOKIE_SECRET`, and set `DATABASE_URL`. Restrict `STORE_CORS`, `ADMIN_CORS`, and `AUTH_CORS` to the local/deployed origins actually in use.

From the `commerce` directory, install the Medusa workspace dependencies, then from `commerce/apps/backend` run its migrations, create an admin user, and start Medusa using the current Medusa installation guide. The admin is served by Medusa at `/app` on its backend origin (normally port 9000). Do not publish default secrets or expose admin CORS broadly.

The storefront checkout route intentionally returns a preview and responds with `503` if `MEDUSA_BACKEND_URL` is set, until a server-side Medusa cart/order adapter is implemented and configured. Do not set that variable expecting live checkout to work. Before launch, connect catalog reads, variant prices, authoritative inventory, COD payment collection, order persistence, and fulfillment to Medusa; never trust browser-submitted prices or stock.

## Courier and payment boundaries

Do not couple order logic to a courier brand. Implement each carrier behind Medusa's fulfillment-provider contract; map carrier tracking states into the order fulfillment model and keep provider shipment IDs/payloads in integration data. Implement COD and future gateways behind payment-provider contracts. Select the first courier only after confirming its Pakistan-wide coverage, COD settlement terms, API, sandbox, and return flow.

## Before launch

1. Replace the temporary wordmark and stock imagery with the supplied logo and approved original product photography.
2. Finalize product copy, ingredient/IFRA claims, pricing, variant SKUs, tax treatment, and actual inventory.
3. Install/configure Medusa with PostgreSQL, secure admin accounts, seed the real catalog, and build the server-side storefront cart/order adapter.
4. Integrate and test a Pakistan courier and COD reconciliation; add address verification, order notifications, cancellation/returns, audit trail, and retryable fulfillment updates.
5. Configure the optional AI key, rate limits, privacy review, monitoring, backups, accessibility, and end-to-end tests before accepting customers.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
