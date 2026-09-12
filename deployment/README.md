# Deployment

Scripts and utilities for deploying Quincy-UI to production.

## IIS Deployment (fix-iis-site-root.ps1)

**Purpose:** Registers the deployed app folder as an IIS Application to enable React Router SPA fallback routing.

**Usage:** See [../CLAUDE.md](../CLAUDE.md#deployment-to-iis) for complete deployment instructions.

**Requirements:**

- Windows IIS server
- PowerShell running as Administrator
- App already built (`npm run build`) and deployed to IIS folder
