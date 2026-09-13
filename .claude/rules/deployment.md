# Deployment to IIS

**Prerequisites:**

- Build the app: `npm run build` (outputs to `dist/`)
- Deploy `dist/` to IIS, e.g. `C:\inetpub\wwwroot\QuincyUI`
- Run Windows PowerShell as Administrator on the IIS server

**Steps:**

1. Copy `deployment/fix-iis-site-root.ps1` to the IIS server.
2. Edit the script to set `$siteName` (IIS site name) and `$physPath` (deployed folder location).
3. Run as Administrator:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   .\fix-iis-site-root.ps1
   ```
4. Verify: deep links to client-side routes (e.g. `/quotes/detail/123`) load without a 404 — the
   script registers the app as an IIS Application and sets `web.config` `httpErrors` fallback to
   `index.html`.

The path is currently hardcoded to `/POC13/` in `vite.config.ts` (see [tech debt](tech-debt.md)).
