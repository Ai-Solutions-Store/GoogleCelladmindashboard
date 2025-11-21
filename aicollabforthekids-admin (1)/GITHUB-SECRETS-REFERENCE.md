# GitHub Secrets Setup Guide - ForTheKids Platform

# CRITICAL: Set these in your GitHub repository before deployment

## How to Add Secrets

1. Navigate to: `https://github.com/Ai-Solutions-Store/GoogleCelladmindashboard/settings/secrets/actions`
2. Click "New repository secret"
3. Add each secret below with exact name and value

---

## Required Production Secrets

### Core Application

```
Name: PROD_JWT_SECRET
Value: <YOUR_JWT_SECRET_HERE>
Description: Authentication token signing key (32+ random characters)
```

```
Name: PROD_BUSINESS_EIN
Value: 33-4655313
Description: Business Tax ID (public info, safe to share)
```

---

### AI Services

```
Name: PROD_GEMINI_API_KEY
Value: <YOUR_GEMINI_API_KEY>
Description: Google Gemini AI API key from https://makersuite.google.com/app/apikey
```

---

### Payment Processing (Square)

```
Name: PROD_SQUARE_ACCESS_TOKEN
Value: <YOUR_SQUARE_ACCESS_TOKEN>
Description: Square production access token from https://developer.squareup.com/apps
```

```
Name: PROD_SQUARE_LOCATION_ID
Value: <YOUR_SQUARE_LOCATION_ID>
Description: Square merchant location ID
```

```
Name: PROD_SQUARE_WEBHOOK_SIGNATURE_KEY
Value: <YOUR_WEBHOOK_KEY>
Description: Square webhook signature verification key (optional, recommended)
```

---

### Database

```
Name: PROD_DATABASE_URL
Value: postgresql://user:password@host:5432/dbname
Description: Full PostgreSQL connection string
```

```
Name: PROD_DB_PASSWORD
Value: <YOUR_DB_PASSWORD>
Description: Standalone DB password (if not using DATABASE_URL)
```

```
Name: PROD_REDIS_HOST
Value: <YOUR_REDIS_HOST>
Description: Redis cache hostname (optional)
```

```
Name: PROD_REDIS_PORT
Value: 6379
Description: Redis port (default 6379)
```

---

### Email & SMS Alerts

```
Name: PROD_GMAIL_USER
Value: <YOUR_GMAIL_ADDRESS>
Description: Gmail account for SMTP alerts
```

```
Name: PROD_GMAIL_APP_PASSWORD
Value: <YOUR_GMAIL_APP_PASSWORD>
Description: Gmail App Password (not regular password)
Generate at: https://myaccount.google.com/apppasswords
```

```
Name: PROD_SMS_EMAIL
Value: <PHONE_NUMBER>@txt.att.net
Description: SMS gateway email (carrier-dependent)
```

---

### Cloudflare (Deployment & DNS)

```
Name: PROD_CLOUDFLARE_API_TOKEN
Value: <YOUR_CLOUDFLARE_API_TOKEN>
Description: Cloudflare API token with Zone:Read, DNS:Edit permissions
Create at: https://dash.cloudflare.com/profile/api-tokens
```

```
Name: PROD_CLOUDFLARE_ZONE_ID
Value: <YOUR_ZONE_ID>
Description: Zone ID for youandinotai.online domain
Find at: Cloudflare Dashboard > Domain > Overview > API section
```

---

### GCP (Optional - if using Google Cloud)

```
Name: PROD_GCP_PROJECT_ID
Value: <YOUR_GCP_PROJECT>
Description: Google Cloud project ID
```

```
Name: PROD_GCP_SQL_PASSWORD
Value: <YOUR_CLOUD_SQL_PASSWORD>
Description: Cloud SQL instance password
```

```
Name: PROD_GCP_SERVICE_ACCOUNT_KEY
Value: <YOUR_SERVICE_ACCOUNT_JSON>
Description: Service account JSON key (entire JSON as string)
```

---

### GitHub Actions (Optional)

```
Name: GH_TOKEN
Value: <YOUR_GITHUB_PAT>
Description: GitHub Personal Access Token for automated releases
Scopes needed: repo, workflow, write:packages
Create at: https://github.com/settings/tokens
```

---

## Verification Commands

### Test Cloudflare Token

```bash
curl "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer YOUR_CLOUDFLARE_API_TOKEN"
```

### Test Gemini API Key

```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_GEMINI_API_KEY"
```

### Test Square Token

```bash
curl https://connect.squareup.com/v2/locations \
  -H "Square-Version: 2023-12-13" \
  -H "Authorization: Bearer YOUR_SQUARE_ACCESS_TOKEN"
```

---

## Security Best Practices

1. **Never commit secrets to git** - Already enforced via `.gitignore`
2. **Rotate high-value keys every 60-90 days** (Square, Gemini, JWT)
3. **Use environment-specific secrets** (staging vs production)
4. **Enable GitHub secret scanning** (already active)
5. **Audit secret access logs** periodically
6. **Use least-privilege principle** (minimal scopes on tokens)

---

## Where Secrets Are Used

| Secret | Used In | Purpose |
|--------|---------|---------|
| PROD_GEMINI_API_KEY | Backend AI routes | Gemini model calls |
| PROD_SQUARE_ACCESS_TOKEN | Payment processing | Live transactions |
| PROD_JWT_SECRET | Auth middleware | Sign/verify JWTs |
| PROD_DATABASE_URL | Backend server | Database connections |
| PROD_CLOUDFLARE_API_TOKEN | Deployment scripts | DNS automation |
| PROD_GMAIL_APP_PASSWORD | Alert system | Email/SMS notifications |

---

## Troubleshooting

**Q: Secret not showing in Actions logs?**
A: Secrets are automatically masked. Check environment variable mapping in workflow YAML.

**Q: Database connection failing?**
A: Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/dbname`

**Q: Cloudflare API returns 403?**
A: Check token permissions include Zone:Read and DNS:Edit.

**Q: Square payment test failing?**
A: Confirm you're using **Production** tokens, not Sandbox.

---

**Last Updated:** 2025-11-21  
**Status:** ✅ Repository cleaned, ready for secret configuration  
**Next Step:** Add secrets via GitHub UI, then deploy with `deploy-backend-production.ps1`
