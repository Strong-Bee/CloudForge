param (
    [Parameter(Mandatory=$true)][string]$Domain,
    [string]$SiteType = "static"
)

$SitesDir = "C:\inetpub\wwwroot"
$SitePath = Join-Path $SitesDir $Domain

if (Test-Path $SitePath) {
    Write-Host "[ERROR] Site directory already exists: $SitePath" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Creating site: $Domain (Type: $SiteType) on Windows" -ForegroundColor Green

New-Item -ItemType Directory -Force -Path "\public" | Out-Null
New-Item -ItemType Directory -Force -Path "\logs" | Out-Null
New-Item -ItemType Directory -Force -Path "\backups" | Out-Null

if ($SiteType -eq "static") {
    $Html = @"
<!DOCTYPE html>
<html>
<head><title>Welcome to $Domain</title><style>body{font-family:sans-serif;text-align:center;padding:50px;background:#1a1a1a;color:#fff;}</style></head>
<body>
    <h1>?? Site Created Successfully!</h1>
    <p>Your site <b>$Domain</b> is running on a Windows Server via CloudForge.</p>
</body>
</html>
"@
    Set-Content -Path "\public\index.html" -Value $Html
} elseif ($SiteType -eq "php") {
    $Php = "<?php echo '<h1>Welcome to Windows PHP Server: ' . $_SERVER['HTTP_HOST'] . '</h1>'; ?>"
    Set-Content -Path "\public\index.php" -Value $Php
}

Write-Host "[INFO] Site created successfully at $SitePath" -ForegroundColor Green
Write-Host "[INFO] Note: On Windows, you may need to configure IIS or Nginx manually for bindings." -ForegroundColor Yellow
