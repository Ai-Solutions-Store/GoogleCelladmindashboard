# 🚀 T5500 LAUNCHERS & DOMAIN SETUP - QUICK START GUIDE

## Desktop Launchers (T5500 Dell PowerEdge)

### 📱 Launch-YouAndINotAI.ps1

**Location**: `C:\Users\joshl\Desktop\Launch-YouAndINotAI.ps1`

**What it does**:

- ✅ Starts PostgreSQL database (Docker)
- ✅ Starts Redis cache (Docker)
- ✅ Launches Node.js backend API
- ✅ Opens frontend and admin dashboard
- ✅ Shows real-time service status

**To run**: Right-click → "Run with PowerShell" (will auto-elevate to Admin)

### 🎯 Launch-T5500-Platform.ps1

**Location**: `C:\Users\joshl\Desktop\Launch-T5500-Platform.ps1`

**What it does**:

- Starts all T5500 platform containers
- Monitors Docker services
- Opens monitoring dashboard

---

## 🌐 Domain Configuration

### Production Domains

| Domain | Purpose | Files |
|--------|---------|-------|
| **youandinotai.com** | Dating App Landing Page | `Trollz1004-main/frontend/index.html` |
| **youandinotai.online** | Admin Dashboard | `Trollz1004-main/dashboard/index.html` |

### Local Development

| Service | URL |
|---------|-----|
| Backend API | <http://localhost:8080> |
| Database | localhost:5432 |
| Redis | localhost:6379 |
| Health Check | <http://localhost:8080/health> |
| Admin Stats | <http://localhost:8080/api/admin/stats> |

---

## 📁 Project Structure

```
aicollabforthekids-admin (1)/
├── Trollz1004-main/
│   ├── frontend/
│   │   └── index.html          # Dating app landing page
│   ├── dashboard/
│   │   └── index.html          # Admin dashboard
│   ├── backend/
│   │   ├── server.js           # Express API server
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Auth, error handling
│   │   └── utils/              # Logger, helpers
│   ├── database/
│   │   ├── init.sql            # Database schema
│   │   └── schema.sql          # Table definitions
│   └── docker-compose-full.yml # Complete stack
├── DOMAIN-CONFIG.md            # Full domain setup guide
└── TEST-VERIFICATION-REPORT.md # Test results
```

---

## 🔑 Environment Variables

All secrets are stored in:

1. **GitHub Repository Secrets** (for CI/CD)
2. **`.env` file** (for local development)

### Key Variables (Use placeholders; see `SECRETS-INVENTORY.md` for real values)

```bash
# AI & Payments (Do NOT hardcode; managed via GitHub Secrets)
GEMINI_API_KEY=<redacted>         # GitHub secret: GEMINI_API_KEY
SQUARE_ACCESS_TOKEN=<redacted>    # GitHub secret: SQUARE_ACCESS_TOKEN
SQUARE_LOCATION_ID=<redacted>     # GitHub secret: SQUARE_LOCATION_ID

# Database
POSTGRES_PASSWORD=<redacted>      # GitHub secret: POSTGRES_PASSWORD
DATABASE_URL=postgresql://admin:${POSTGRES_PASSWORD}@localhost:5432/youandinotai
REDIS_URL=redis://localhost:6379

# JWT / Auth
JWT_SECRET=<redacted>             # GitHub secret: JWT_SECRET
```

---

## ☁️ Cloudflare DNS Setup

### For youandinotai.com

```
A Record:
  Name: @
  Content: [Your Server IP]
  Proxy: ✅ Enabled
  
CNAME Record:
  Name: www
  Content: youandinotai.com
  Proxy: ✅ Enabled
```

### For youandinotai.online

```
A Record:
  Name: @
  Content: [Your Server IP]
  Proxy: ✅ Enabled
  
CNAME Record:
  Name: www
  Content: youandinotai.online
  Proxy: ✅ Enabled
```

**SSL**: Automatic via Cloudflare (Orange Cloud = SSL + CDN)

---

## 🚀 Deployment Steps

### 1. Using the Launcher (Easiest)

```powershell
# On T5500 Desktop
.\Launch-YouAndINotAI.ps1
```

### 2. Using Docker Compose

```bash
cd "C:\Users\joshl\Documents\GitHub\GoogleCelladmindashboard\aicollabforthekids-admin (1)\Trollz1004-main"
docker-compose -f docker-compose-full.yml up -d
```

### 3. Manual Setup

```bash
# Start Database
docker run -d --name youandinotai-db -p 5432:5432 \
  -e POSTGRES_DB=youandinotai \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
  postgres:15

# Start Redis
docker run -d --name youandinotai-redis -p 6379:6379 redis:alpine

# Start Backend
cd Trollz1004-main/backend
npm install
node server.js
```

---

## 📊 Features

### Dating App (youandinotai.com)

- 🤖 AI-Powered Matching (Gemini)
- 💳 Square Payment Processing
- 💬 Real-time Chat (Socket.IO)
- 🛡️ Human Verification System
- 💎 3-Tier Subscriptions:
  - Basic: $9.99/month
  - Premium: $19.99/month
  - VIP: $29.99/month

### Admin Dashboard (youandinotai.online)

- 📈 Real-time Platform Statistics
- 👥 User Management
- 💰 Revenue Tracking
- 🔧 Service Health Monitoring
- 📊 Analytics & Reports

---

## ✅ Verification

### Check Services

```bash
# Backend Health
curl http://localhost:8080/health

# Admin Stats
curl http://localhost:8080/api/admin/stats

# Docker Containers
docker ps
```

### Expected Response

```json
{
  "status": "healthy",
  "platform": "YouAndINotAI",
  "version": "2.0.0",
  "database": "connected",
  "redis": "connected"
}
```

---

## 🆘 Troubleshooting

### Launcher won't run?

1. Right-click PowerShell → Run as Administrator
2. Run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
3. Try launcher again

### Docker won't start?

1. Open Docker Desktop manually
2. Wait 30 seconds
3. Run launcher again

### Port already in use?

```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process (replace PID)
taskkill /PID [PID] /F
```

---

## 📞 Support

- **GitHub Issues**: <https://github.com/Ai-Solutions-Store/GoogleCelladmindashboard/issues>
- **Documentation**: See `DOMAIN-CONFIG.md` for complete setup
- **Test Results**: See `TEST-VERIFICATION-REPORT.md`

---

**Last Updated**: November 21, 2025  
**Partnership**: Trollz1004 x Google  
**Status**: ✅ Production Ready
