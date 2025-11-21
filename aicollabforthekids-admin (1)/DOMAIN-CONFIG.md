# 🌐 DOMAIN CONFIGURATION - TROLLZ1004 PARTNERSHIP

## Domain Mapping

### Production Domains

- **youandinotai.com** - Dating App Landing Page (Frontend)
- **youandinotai.online** - Google Admin Dashboard (this repo)

## DNS Configuration (Cloudflare)

### For youandinotai.com (Dating App)

```
Type: A
Name: @
Content: [Your-Server-IP]
Proxy: Enabled (Orange Cloud)
TTL: Auto

Type: CNAME  
Name: www
Content: youandinotai.com
Proxy: Enabled
TTL: Auto
```

### For youandinotai.online (Admin Dashboard)

```
Type: A
Name: @
Content: [Your-Server-IP]
Proxy: Enabled (Orange Cloud)
TTL: Auto

Type: CNAME
Name: www
Content: youandinotai.online
Proxy: Enabled
TTL: Auto
```

## File Structure

### Dating App (youandinotai.com)

Located in: `Trollz1004-main/frontend/index.html`

- Clean landing page
- Signup/Login modals
- AI-powered features showcase
- Pricing tiers ($9.99, $19.99, $29.99)

### Admin Dashboard (youandinotai.online)

Located in: `Trollz1004-main/dashboard/index.html`

- Real-time platform statistics
- User management
- Revenue tracking
- Service health monitoring

## Backend API

Located in: `Trollz1004-main/backend/server.js`

- Express.js server
- PostgreSQL database
- Redis caching
- Socket.IO real-time features

## Environment Variables

All secrets are stored in:

1. GitHub Secrets (for CI/CD)
2. `.env` file (local development)

### Required Environment Variables (Placeholders – see `SECRETS-INVENTORY.md` for mapping)

```bash
# Core Application
PORT=8080
NODE_ENV=production

# Database (use consolidated POSTGRES_PASSWORD and DATABASE_URL, avoid separate DB_* vars)
POSTGRES_PASSWORD=<redacted>
DATABASE_URL=postgresql://admin:${POSTGRES_PASSWORD}@localhost:5432/youandinotai

# Cache
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=<redacted>

# External Services (never commit real values)
GEMINI_API_KEY=<redacted>
SQUARE_ACCESS_TOKEN=<redacted>
SQUARE_LOCATION_ID=<redacted>
```

## Deployment

### Using Docker Compose

```bash
cd Trollz1004-main
docker-compose -f docker-compose-full.yml up -d
```

### Manual Deployment

```bash
# Backend
cd Trollz1004-main/backend
npm install
node server.js

# Database
psql -U postgres -f ../database/init.sql
```

## SSL Certificates

Cloudflare provides automatic SSL certificates when proxy is enabled (orange cloud).

For custom SSL:

1. Generate certificates via Cloudflare Origin Certificates
2. Install on your server
3. Configure nginx/apache accordingly

## Health Checks

- **Dating App**: `https://youandinotai.com/`
- **Admin Dashboard**: `https://youandinotai.online/`
- **API Health**: `https://youandinotai.com/health`
- **Backend Status**: `https://youandinotai.com/api/admin/stats`

## Monitoring

Use the T5500 Dashboard launcher to monitor all services:

```powershell
.\T5500-Dashboard.ps1
```

## Support

All services are configured with:

- 24/7 uptime monitoring
- Automatic health checks every 30 seconds
- Error logging with Winston
- Real-time alerts via CI/CD workflows

---

**Last Updated**: November 21, 2025  
**Maintained By**: Trollz1004 x Google Partnership
