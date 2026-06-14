# Banco de dados PostgreSQL

As migrations desta pasta preparam o banco para substituir os dados mockados de
membros e visitantes. Elas usam apenas SQL PostgreSQL e não dependem de ORM.

## Estrutura

- `migrations/001_initial_schema.sql`: tabelas, constraints, índices e triggers.
- `migrations/002_directory_views.sql`: views prontas para consultas das telas.
- `migrations/003_seed_mock_data.sql`: ministérios e todos os registros mockados.

O seed é idempotente para facilitar o desenvolvimento. As migrations de schema
devem ser executadas apenas uma vez em cada banco.

## Executar

Defina uma conexão PostgreSQL e execute os arquivos na ordem:

```powershell
$env:DATABASE_URL="postgresql://usuario:senha@localhost:5432/sib_mirassol"
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f database/migrations/001_initial_schema.sql
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f database/migrations/002_directory_views.sql
psql $env:DATABASE_URL -v ON_ERROR_STOP=1 -f database/migrations/003_seed_mock_data.sql
```

No PowerShell, também é possível executar todas em ordem:

```powershell
.\database\migrate.ps1
```

O executor mantém a tabela `schema_migrations` e ignora automaticamente os
arquivos já aplicados.

O usuário da conexão precisa ter permissão para habilitar a extensão
`pgcrypto`, usada para gerar UUIDs.

## Consultas para as telas

```sql
SELECT * FROM member_directory ORDER BY admission_date DESC;
SELECT * FROM visitor_directory ORDER BY visit_date DESC;
```

Valores persistidos usam identificadores estáveis:

| Banco | Interface |
| --- | --- |
| `active` / `inactive` | Ativo / Inativo |
| `baptized` / `waiting` | Batizado / Aguardando |
| `waiting_contact` | Aguardando Contato |
| `following_up` | Em Acompanhamento |
| `integrated` | Integrado |

`people` concentra os dados pessoais compartilhados. Um registro pode ser
associado a `members`, `visitors` ou ambos sem duplicar informações pessoais.
