$ErrorActionPreference = "Stop"

if (-not $env:DATABASE_URL) {
  throw "Defina DATABASE_URL antes de executar as migrations."
}

if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  throw "O comando psql não foi encontrado no PATH."
}

$migrationDirectory = Join-Path $PSScriptRoot "migrations"
$migrations = Get-ChildItem -LiteralPath $migrationDirectory -Filter "*.sql" |
  Sort-Object Name

& psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -c @"
CREATE TABLE IF NOT EXISTS schema_migrations (
  filename varchar(255) PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
"@
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao preparar o histórico de migrations."
}

$appliedMigrations = @(
  & psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -t -A -c "SELECT filename FROM schema_migrations;"
)
if ($LASTEXITCODE -ne 0) {
  throw "Falha ao consultar o histórico de migrations."
}

foreach ($migration in $migrations) {
  if ($appliedMigrations -contains $migration.Name) {
    Write-Host "Ignorando $($migration.Name), já executada."
    continue
  }

  Write-Host "Executando $($migration.Name)..."
  & psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f $migration.FullName
  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao executar $($migration.Name)."
  }

  $escapedName = $migration.Name.Replace("'", "''")
  & psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -c "INSERT INTO schema_migrations (filename) VALUES ('$escapedName');"
  if ($LASTEXITCODE -ne 0) {
    throw "A migration foi executada, mas não foi registrada: $($migration.Name)."
  }
}

Write-Host "Migrations executadas com sucesso."
