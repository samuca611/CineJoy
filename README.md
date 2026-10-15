# CineJoy Web

Projeto web do CineJoy em React e Next.js.

## Organizacao

- `frontend`: telas do site.
- `Back-end/Api`: API C#.
- `Back-end/database`: scripts SQL Server.

No frontend, `ui` tem as telas e estilos, `data` tem os dados e chamadas HTTP,
e `viewmodel` liga as acoes das telas aos dados. `src/app` e a entrada do Next.js.

Na API, `Models` tem as classes, `Controllers` tem as rotas e operacoes,
e `Data` guarda o acesso ao banco. A API retorna JSON para as telas React.

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

## Observacao

Esta copia ainda depende dos arquivos restantes das entregas de Henry e Giovana.
Ha chamadas para modulos que ainda nao foram adicionados, tanto no frontend
quanto na API. Os comandos abaixo precisam dessas partes para funcionar.

## Como rodar a API

Em outro terminal, na raiz do projeto:

```powershell
cd Back-end/Api
dotnet run
```

Acesse http://localhost:8080/api/filmes ou http://localhost:8080/api/unidades.
Os detalhes dos vinculos e do banco estao em `Back-end/README.md`.
