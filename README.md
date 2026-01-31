# SloaneX

Production-ready Next.js 15 App Router project for exclusive photo/video content with a pink/purple fashion aesthetic. Payments are intentionally removed.

## Requirements

- **Node.js >= 24**
- Postgres database (Neon/Supabase)
- Vercel Blob for media storage
- Resend for transactional emails

## Tech Stack

- Next.js 15.5.9+
- React 19
- TypeScript
- Tailwind CSS
- Prisma + Postgres
- Vercel Blob (uploads + signed URLs)
- Resend (emails)

## Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
RESEND_API_KEY=your_resend_key
RESEND_FROM=updates@sloanex.example
BLOB_READ_WRITE_TOKEN=vercel_blob_token
APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me
```

## Local Development

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Visit `http://localhost:3000`.

## Vercel Deployment

1. Add the environment variables above in Vercel.
2. Set the Node.js version to **24.x** or newer.
3. Ensure the Postgres database and Vercel Blob integrations are connected.

## Notes

- Login is available at `/login` for approved users. The landing page buttons remain under construction.
- Terms gating is enforced via middleware and cookies (`termsAgreed` + `ageConfirmed`).
- Exclusive media is served through a protected API route that issues short-lived signed URLs.

## Troubleshooting

- If `npm install` fails with `403 Forbidden` fetching `@prisma/client`:
  - Allowlist Prisma packages on your network/security proxy. The 403 is coming directly from `registry.npmjs.org`, which usually means a proxy or policy is blocking `@prisma/*` packages. Ensure `@prisma/client` (and any Prisma-related packages) are permitted through your proxy/firewall rules.
  - Verify npm registry access is not intercepted by a proxy. The repo already forces the public registry, so if a global or corporate proxy blocks Prisma, disable it or configure it to allow Prisma packages.
  - If your organization uses a private npm mirror, ensure it is synced and allows `@prisma/client`. If your network routes through a mirror, update mirror policies or use a registry override that has access to Prisma packages.
