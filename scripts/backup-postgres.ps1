$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$backupDirectory = Join-Path $root "backups\postgres"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = Join-Path $backupDirectory "hello-agencia-$timestamp.sql"

New-Item -ItemType Directory -Force -Path $backupDirectory | Out-Null

$dumpCommand = 'pg_dump --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" --clean --if-exists --no-owner'

docker compose exec -T postgres-db sh -c $dumpCommand |
  Set-Content -Encoding utf8 -LiteralPath $backupFile

if (-not (Test-Path -LiteralPath $backupFile) -or (Get-Item $backupFile).Length -eq 0) {
  throw "El backup de PostgreSQL quedó vacío."
}

Write-Output "Backup creado: $backupFile"
