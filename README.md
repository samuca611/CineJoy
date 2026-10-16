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
C:\Users\samue\OneDrive\Documentos\GitHub\CineJoyWEB2\frontend
npm install
npm run dev
```

Depois acesse:

```text
http://localhost:3000
```

## Como rodar a API

Em outro terminal, na raiz do projeto:

```powershell
C:\Users\samue\OneDrive\Documentos\GitHub\CineJoyWEB2\Back-end\Api
dotnet run
```

