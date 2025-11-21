# YOLO MODE DEPLOYMENT - QUICK START

## FOR THE KIDS! #Gemini3FORtheKIDS

**Archive:** dist-20251121-160504.tar.gz  
**SHA256:** AE666FEE6883AD5DF715E13487933C3A04FF7CDACDF1838B7BA9CE53DB03FA6F

---

## OPTION 1: Direct Server Access (if SSH available)

1. Upload archive to server:

   ```bash
   # Via SCP (if you have direct server IP, not proxied through Cloudflare):
   scp dist-20251121-160504.tar.gz root@SERVER_DIRECT_IP:/var/www/youandinotai.online/releases/
   
   # Or via SFTP/control panel file manager
   ```

2. SSH into server and activate:

   ```bash
   ssh root@SERVER_DIRECT_IP
   cd /var/www/youandinotai.online/releases
   tar -xzf dist-20251121-160504.tar.gz
   ln -sfn /var/www/youandinotai.online/releases/dist-20251121-160504/dist /var/www/youandinotai.online/current
   chown -R www-data:www-data /var/www/youandinotai.online/current
   chmod -R 755 /var/www/youandinotai.online/current
   systemctl reload nginx
   ```

---

## OPTION 2: Cloudflare Pages Direct Deploy (FASTEST)

Since SSH timed out and domain is Cloudflare-proxied, deploy via Cloudflare Pages:

### A. Connect Repository

1. Go to <https://dash.cloudflare.com/>
2. Pages > Create a project
3. Connect GitHub: Ai-Solutions-Store/GoogleCelladmindashboard
4. Configure build:
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `/`

### B. Manual Upload (IMMEDIATE)

1. Go to <https://dash.cloudflare.com/> > Pages
2. Upload assets
3. Drag the entire `dist` folder from this project
4. Deploy as youandinotai.online

---

## OPTION 3: GitHub Pages (Alternative)

```powershell
# Push dist to gh-pages branch
cd dist
git init
git add .
git commit -m "Deploy dashboard $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git branch -M gh-pages
git remote add origin https://github.com/Ai-Solutions-Store/GoogleCelladmindashboard.git
git push -f origin gh-pages
```

Then in GitHub repo settings:

- Settings > Pages
- Source: gh-pages branch
- Custom domain: youandinotai.online

---

## OPTION 4: Extract & Manual FTP Upload

If you have cPanel/FTP access:

```powershell
# Extract locally first
tar -xzf dist-20251121-160504.tar.gz
```

Then upload the entire `dist/dist` folder contents to your web root via FTP client (FileZilla):

- Host: youandinotai.online
- User: (your FTP user)
- Upload to: `/public_html/` or `/var/www/html/`

---

## POST-DEPLOY: Cloudflare Cache Purge

**CRITICAL:** After any deploy method, purge cache:

```powershell
# Set your Cloudflare credentials:
$env:CLOUDFLARE_ZONE_ID = "YOUR_ZONE_ID"
$env:CLOUDFLARE_API_TOKEN = "YOUR_API_TOKEN"

# Purge everything:
.\scripts\cloudflare-purge.ps1 -Everything
```

Or via Cloudflare Dashboard:

1. <https://dash.cloudflare.com/>
2. Select youandinotai.online zone
3. Caching > Configuration
4. Purge Everything

---

## VERIFICATION

```bash
# Check if new dashboard is live:
curl -s https://youandinotai.online/ | grep "Initializing Ai-Solutions-Store"

# Should return the loader text from new dashboard
```

Browser test:

1. Open <https://youandinotai.online/>
2. Hard refresh (CTRL+F5 or CMD+SHIFT+R)
3. Verify you see the glassmorphic dashboard with reactor loader

---

## NGINX CONFIG (if managing server directly)

Ensure `/etc/nginx/sites-available/youandinotai.online` contains:

```nginx
server {
    listen 80;
    server_name youandinotai.online www.youandinotai.online;
    return 301 https://youandinotai.online$request_uri;
}

server {
    listen 443 ssl http2;
    server_name youandinotai.online www.youandinotai.online;
    
    root /var/www/youandinotai.online/current;
    index index.html;

    ssl_certificate /etc/ssl/certs/cloudflare-origin.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare-origin.key;

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Test and reload:

```bash
nginx -t && systemctl reload nginx
```

---

## TROUBLESHOOTING

### Still seeing old landing page?

1. Check Cloudflare cache: Purge Everything
2. Check browser cache: Hard refresh (CTRL+F5)
3. Verify file on server: `cat /var/www/youandinotai.online/current/index.html | head -20`
4. Check symlink: `ls -la /var/www/youandinotai.online/current`

### Multiple domains serving same page?

Each domain needs separate nginx server block:

```nginx
server {
    listen 443 ssl http2;
    server_name anotherdomain.com;
    root /var/www/anotherdomain.com/current;
    # ... rest of config
}
```

Or redirect to primary:

```nginx
server {
    listen 443 ssl http2;
    server_name olddomain.com;
    return 301 https://youandinotai.online$request_uri;
}
```

---

## ROLLBACK

```bash
ln -sfn /var/www/youandinotai.online/releases/dist-20251121-155917/dist /var/www/youandinotai.online/current
systemctl reload nginx
```

---

**Mission:** 50% profits → Shriners Children's Hospitals  
**Status:** READY FOR LAUNCH  
**FOR THE KIDS!** 💖
