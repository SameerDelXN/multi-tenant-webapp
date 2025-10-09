# Multi-Tenant Webapp – Developer Setup Guide

This project supports domain-based tenants in development. New developers should follow these steps to run any tenant (e.g., gardening1, bn) locally.

## 1) Prerequisites
- Node.js LTS installed
- A running backend API (see backend guide)

## 2) Environment variables
Create `.env.local` in `multi-tenant-webapp/`:

```
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Optional: marketing/main site host (used for redirects on tenant-not-found)
NEXT_PUBLIC_MAIN_DOMAIN=http://localhost:3000
```

## 3) Start the webapp
```
npm install
npm run dev
```
The app serves on http://localhost:3000 by default.

## 4) How tenant domains are resolved in dev
Frontend determines the tenant using the browser host. Typical options:

- Option A: localhost with explicit tenant parameter (no OS changes)
  - Open: `http://localhost:3000?tenant=<tenantName>`
  - The frontend will send `X-Tenant-Domain: <tenantName>` to the backend.

- Option B: custom hostnames via the hosts file (OS-level)
  - Edit your hosts file and map a name to 127.0.0.1.
    - Windows: `C:\\Windows\\System32\\drivers\\etc\\hosts`
    - Add a line, e.g.: `127.0.0.1   gardening1`
  - Then open: `http://gardening1:3000`

- Option C: nip.io wildcard DNS (no hosts edits)
  - Open: `http://gardening1.127.0.0.1.nip.io:3000`

Note: If you use B or C, the frontend will treat the full host as the tenant domain and send it in `X-Tenant-Domain`.

## 5) Creating tenants
- Use the Super Admin UI to create tenants: `Super Admin → Tenants → New`.
- Each tenant must have a unique `subdomain` (this is what you map in the hosts file or pass via `?tenant=`).

## 6) Stripe redirects (optional)
For Stripe success/cancel/portal redirects, ensure the backend is configured (see backend guide) with a tenant-aware base URL using `TENANT_APP_BASE_URL`.

## 7) Common issues
- bn:3000 doesn’t load: your OS can’t resolve `bn`. Either use `http://localhost:3000?tenant=bn` or add `127.0.0.1 bn` to your hosts file.
- Tenant not found: ensure the tenant exists in the database and the name matches your host/parameter.
