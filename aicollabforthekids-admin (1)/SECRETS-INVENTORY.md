# 🔐 Centralized Secrets & Configuration Inventory

This file is the authoritative ("gospel") reference for all sensitive configuration required by the YouAndINotAI platform (dating app + admin dashboard). Actual secret VALUES are never stored here—only variable names, purpose, and where they live.

---

## 1. Storage Locations

| Location | Usage | Notes |
|----------|-------|-------|
| Local `.env` | Developer runtime | Should be excluded by `.gitignore` |
| GitHub Actions Secrets | CI/CD, deployments | Set via repo Settings > Secrets and variables > Actions |
| Cloud provider (e.g. Secret Manager) | Optional runtime injection | Future enhancement |

---

## 2. Environment Variable Master List

| Variable | Scope | Purpose | Required In | GitHub Secret Name (Recommended) |
|----------|-------|---------|-------------|----------------------------------|
| `GEMINI_API_KEY` | Backend / AI | Gemini model calls | `.env`, Actions | `PROD_GEMINI_API_KEY` |
| `SQUARE_ACCESS_TOKEN` | Payments | Square charge/subscription API | `.env`, Actions | `PROD_SQUARE_ACCESS_TOKEN` |
| `SQUARE_LOCATION_ID` | Payments | Square location context | `.env` | `PROD_SQUARE_LOCATION_ID` |
| `JWT_SECRET` | Auth | Sign & verify user tokens | `.env`, Actions | `PROD_JWT_SECRET` |
| `DATABASE_URL` | DB | Connection string (includes password) | `.env`, Actions | `PROD_DATABASE_URL` |
| `DB_HOST` | DB | Host override (optional) | `.env` | `PROD_DB_HOST` |
| `DB_PORT` | DB | Port (5432) | `.env` | `PROD_DB_PORT` |
| `DB_USER` | DB | Username | `.env` | `PROD_DB_USER` |
| `DB_PASSWORD` | DB | Password (if not in URL) | `.env`, Actions | `PROD_DB_PASSWORD` |
| `REDIS_HOST` | Cache | Redis hostname | `.env` | `PROD_REDIS_HOST` |
| `REDIS_PORT` | Cache | Redis port | `.env` | `PROD_REDIS_PORT` |
| `API_KEY` | (Legacy) Gemini wrapper components | Frontend safety (should use server) | Remove from client | (Use backend only) |
| `PORT` | Backend | Express listen port | `.env` | (Not secret) |

---

## 3. Files Referencing Secrets (Scan Results)

| File | Reference Type | Current State |
|------|----------------|---------------|
| `Trollz1004-main/backend/server.js` | Reads DB/Gemini/Square env | OK (no hardcoded values) |
| `components/MediaStudio.tsx` | Uses `process.env.API_KEY` | Move all AI calls server-side (avoid exposing) |
| `components/SecurityNexus.tsx` | Masked `Gemini` key fragment | Acceptable (masked only) |
| `guardian/revenue-guardian.js` | `process.env.API_KEY` | Consolidate to `GEMINI_API_KEY` |
| `DOMAIN-CONFIG.md` | Example values (contained secrets) | REDACT REQUIRED (remove real values) |
| `LAUNCHER-GUIDE.md` | Real keys present | REDACT REQUIRED (replace with `<redacted>`) |
| `Trollz1004-main/TEST-RESULTS.md` | Previously exposed secrets | Cleaned & redacted ✅ |

---

## 4. Immediate Remediation Actions

| Priority | Action | Owner | Status |
|----------|--------|-------|--------|
| High | Remove real keys from `DOMAIN-CONFIG.md` | Repo maintainer | Pending |
| High | Remove real keys from `LAUNCHER-GUIDE.md` | Repo maintainer | Pending |
| High | Replace any frontend direct API key usage | Dev team | Planned |
| Medium | Standardize Gemini usage via backend proxy | Backend | Planned |
| Medium | Adopt GitHub Environments for prod/stage secrets | DevOps | Backlog |
| Low | Add secret scanning pre-commit hook | DevOps | Backlog |

---

## 5. Recommended GitHub Actions Secret Mapping

Set these under: Repository Settings > Secrets and variables > Actions

| Secret Name | Value Source | Consumed By |
|-------------|--------------|-------------|
| `PROD_GEMINI_API_KEY` | Gemini console | Backend (AI routes) |
| `PROD_SQUARE_ACCESS_TOKEN` | Square dashboard | Payments routes |
| `PROD_SQUARE_LOCATION_ID` | Square dashboard | Payments routes |
| `PROD_JWT_SECRET` | Generated (32+ random bytes) | Auth middleware |
| `PROD_DATABASE_URL` | Constructed DSN | DB init + pooling |
| `PROD_DB_PASSWORD` | If not embedded in URL | Migrations / pooling |
| `PROD_REDIS_HOST` | Redis service/cluster host | Cache init |
| `PROD_REDIS_PORT` | Usually 6379 | Cache init |

---

## 6. Secure Handling Guidelines

- NEVER commit plaintext secrets (API keys, tokens, passwords).
- Use `.env` locally; ensure `.env*` patterns are in `.gitignore`.
- Prefer single `DATABASE_URL` over separate host/user/password variables.
- Frontend must NOT directly embed high-value secrets—route through backend.
- Rotate keys at least quarterly or after any suspected exposure.
- Enable GitHub secret scanning & Dependabot alerts (already active per pushes).

---

## 7. Rotation & Validation Checklist

| Secret | Rotation Interval | Validation Method |
|--------|-------------------|-------------------|
| Gemini API Key | 90 days | Test AI route 200 OK |
| Square Access Token | 60 days | List locations API call |
| JWT Secret | On compromise / annual | Invalidate old tokens |
| DB Password | 180 days | Reconnect pool without errors |
| Redis Host/Port | Rarely (infra change) | Ping command success |

---

## 8. Future Enhancements

- Implement Vault / Secret Manager integration.
- Add automated GitHub Action to fail build if secrets appear in diff.
- Add SOPS + KMS encryption for any required repo-stored config fragments.

---

## 9. Verification Log

| Date | Action | Result |
|------|--------|--------|
| 2025-11-21 | Initial audit & redaction | ✅ Completed |
| 2025-11-21 | Secrets inventory created | ✅ This file |

---
**Last Updated:** 2025-11-21
**Authoritative Source:** This file within the admin VS Code workspace.
