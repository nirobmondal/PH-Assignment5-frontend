# Niramoy Frontend

Web client for **Niramoy**, a multi-vendor online medicine marketplace. Customers browse and buy medicines; sellers manage catalog and orders; admins oversee users, taxonomy, and platform data. The UI talks to the **Niramoy Backend** REST API using **cookie-based JWT** sessions and **Google sign-in**. Checkout redirects to **Stripe** via URLs returned by the API.

## Live demo

| Environment | URL |
|-------------|-----|
| Production (Vercel) | _Add your link after deploy_ |


## Tech stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/) / Radix primitives, `next-themes`, Lucide icons
- **Data & forms:** [TanStack Query](https://tanstack.com/query), TanStack Form, TanStack Table
- **HTTP:** [Axios](https://axios-http.com/) server-side client with `next/headers` cookies and `withCredentials`
- **Auth UX:** [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google); JWT decode/refresh helpers (`jsonwebtoken` where used server-side)
- **Charts & UX:** Recharts, Sonner toasts, Embla carousel, Vaul drawer, cmdk, date-fns
- **Deploy:** [Vercel](https://vercel.com/) (recommended for Next.js)

## Core features

- **Public site:** Home, medicine catalog and detail, static pages (about, contact, delivery, FAQs, terms).
- **Auth:** Register, login, email verification (OTP), forgot/reset password, change password, **Google** button, logout; tokens stored in **HTTP-only cookies** aligned with the backend.
- **Customer:** Dashboard, cart, checkout, orders, Stripe return page (`/dashboard/payment/success`), become seller.
- **Seller:** Dashboard, manage medicines, manage orders.
- **Admin:** Dashboard, manage users, categories, manufacturers, orders, reviews.
- **Shared:** Role-aware navigation, data tables, stats cards, profile area.

## Project structure

```text
src/
├── app/                          # App Router routes & layouts
│   ├── (commonLayout)/           # Public + auth pages (home, medicine, login, …)
│   ├── (dashboardLayout)/        # Authenticated dashboards (customer / seller / admin)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── modules/                  # Feature UI (Auth, Cart, Medicine, Order, …)
│   ├── shared/                   # Navbar, footer, tables, cells, …
│   └── ui/                       # shadcn-style primitives
├── lib/                          # axios client, auth helpers, JWT/token utils, nav config
├── providers/                    # React Query provider
├── services/                     # Server actions / API calls per domain
├── types/                        # TypeScript models
├── zod/                          # Validation schemas
└── proxy.ts                      # Route-guard / refresh logic (wire as Next middleware if used)
```

## Prerequisites

- Node.js 20+ (matches `@types/node` in the project)
- npm
- Running **Niramoy Backend** with CORS allowing this app’s origin and credentials (see the backend README in `Niramoy-Backend/`)

## Environment variables

Create `.env.local` in the project root (Next.js loads it for `next dev` / `next build`).

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL including version prefix, e.g. `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Google OAuth Web client ID for `@react-oauth/google` |
| `JWT_ACCESS_SECRET` | If using `src/proxy.ts` as middleware | Same secret the backend uses to sign access tokens (`ACCESS_TOKEN_SECRET`) for edge verification |


## Local setup

```bash
cd niramoy-frontend
npm install
```

Add `.env.local` as described above, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run lint` | ESLint |

