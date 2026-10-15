# CineJoy Web

Projeto web do CineJoy em React e Next.js.

## Organizacao

- `frontend`: telas do site.
- `Back-end/Api`: API C# compartilhada por Samuel e Henry.
- `Back-end/database`: scripts SQL Server.
- `docs`: documentos de organizacao do projeto.

## Como rodar

Abra o PowerShell na pasta do projeto e execute:

```powershell
cd frontend
npm install
npm run dev
```

Depois acesse:

```text
http://localhost:3000
```

Se preferir usar pnpm:

```powershell
cd frontend
pnpm install
pnpm run dev
```

## Observacao

As telas ainda usam dados locais. A API C# tambem usa dados em memoria,
mas ja reune filmes, sessoes, ingressos, unidades, salas e funcionarios.

## Como rodar a API

Em outro terminal, na raiz do projeto:

```powershell
cd Back-end/Api
dotnet run
```

Acesse http://localhost:8080/api/filmes ou http://localhost:8080/api/unidades.
Os detalhes dos vinculos e do banco estao em `Back-end/README.md`.
