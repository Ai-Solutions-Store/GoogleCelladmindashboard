<#
Cloudflare Full Cache Purge + HTML Specific Invalidation
Requires environment variables:
  CLOUDFLARE_ZONE_ID  (Zone identifier)
  CLOUDFLARE_API_TOKEN (Scoped token with Cache Purge permission)
Optional:
  CLOUDFLARE_EMAIL (legacy key auth - not recommended)
#>
param(
  [switch]$Everything,
  [string[]]$Files = @("https://youandinotai.online/index.html")
)

if (-not $env:CLOUDFLARE_ZONE_ID -or -not $env:CLOUDFLARE_API_TOKEN) {
  Write-Error "Cloudflare environment variables missing."
  exit 1
}

$Headers = @{ 
  Authorization  = "Bearer $($env:CLOUDFLARE_API_TOKEN)" 
  'Content-Type' = 'application/json' 
}

if ($Everything) {
  Write-Host "🔄 Purging entire Cloudflare cache for zone $($env:CLOUDFLARE_ZONE_ID) ..." -ForegroundColor Yellow
  $Body = '{"purge_everything":true}'
}
else {
  Write-Host "🧼 Purging specific files: $($Files -join ', ')" -ForegroundColor Yellow
  $jsonFiles = ($Files | ConvertTo-Json -Compress)
  $Body = '{"files":' + $jsonFiles + '}'
}

$Response = Invoke-RestMethod -Method Post -Uri "https://api.cloudflare.com/client/v4/zones/$($env:CLOUDFLARE_ZONE_ID)/purge_cache" -Headers $Headers -Body $Body

if ($Response.success) {
  Write-Host "✅ Cache purge successful" -ForegroundColor Green
}
else {
  Write-Error "❌ Cache purge failed: $($Response.errors | ConvertTo-Json)"
}
