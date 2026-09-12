# Run this script as Administrator on the IIS server.
#
# Registers the deployed app folder as an IIS Application so the web.config
# httpErrors path="index.html" SPA fallback resolves correctly for React Router.
#
# ── Configure these two values before running ────────────────────────────────
$siteName = "QuincyUI"                     # IIS site name (check inetmgr)
$physPath = "C:\inetpub\wwwroot\QuincyUI"  # Folder where dist/ was deployed
# ─────────────────────────────────────────────────────────────────────────────

$appcmd = "$env:windir\system32\inetsrv\appcmd.exe"

if (-not (Test-Path $physPath)) {
    Write-Error "App folder not found at '$physPath' — deploy the build first."
    exit 1
}

Write-Host "Registering IIS application: '$siteName' -> $physPath" -ForegroundColor Yellow
& $appcmd delete app "/app.name:$siteName/" 2>$null
& $appcmd add app "/site.name:$siteName" "/path:/" "/physicalPath:$physPath"

if ($?) {
    Write-Host ""
    Write-Host "Done. SPA routing is active." -ForegroundColor Green
    Write-Host "  Site: $siteName  ->  $physPath" -ForegroundColor Green
} else {
    Write-Error "appcmd failed — check the site name and folder path above."
    exit 1
}
