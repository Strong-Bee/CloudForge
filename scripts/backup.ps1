# CloudForge - Advanced Windows Backup Script
param (
    [string]$BackupType = "all",
    [string]$Target = ""
)

$BackupRoot = "C:\backups"
$Date = Get-Date -Format "yyyyMMdd_HHmmss"

# Fungsi untuk mendeteksi IIS (Web Server Windows)
$IsIisInstalled = (Get-Service -Name "W3SVC" -ErrorAction SilentlyContinue) -ne $null

function Backup-Website ($SiteName, $PhysicalPath) {
    if (-not $PhysicalPath) { return }
    $Dest = Join-Path $BackupRoot "websites\\"
    New-Item -ItemType Directory -Force -Path $Dest | Out-Null
    Write-Host "[INFO] Backing up $SiteName from $PhysicalPath" -ForegroundColor Cyan
    Compress-Archive -Path "\*" -DestinationPath "\files.zip" -Force
}

if ($BackupType -eq "website" -or $BackupType -eq "all") {
    if ($IsIisInstalled -and -not $Target) {
        # Ambil semua site dari IIS
        Import-Module WebAdministration
        Get-ChildItem IIS:\Sites | ForEach-Object {
            Backup-Website -SiteName $_.Name -PhysicalPath $_.PhysicalPath
        }
    } else {
        # Fallback folder default jika tidak ada IIS
        $SitesDir = "C:\inetpub\wwwroot"
        $Sites = if ($Target) { @($Target) } else { Get-ChildItem $SitesDir -Directory | Select-Object -ExpandProperty Name }
        foreach ($Site in $Sites) {
            Backup-Website -SiteName $Site -PhysicalPath (Join-Path $SitesDir $Site)
        }
    }
}
Write-Host "[SUCCESS] Backup Process Completed." -ForegroundColor Green
