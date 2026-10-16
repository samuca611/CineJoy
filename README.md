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
npm ci
npm run dev
```

Depois acesse:

```text
http://localhost:3000
```

## Como rodar a API

Em outro terminal, na raiz do projeto:

```powershell
cd Back-end/Api
dotnet run
```

## Em outro computador

Precisa de Node.js compativel com o projeto, npm e SDK do .NET 8 ou compativel.
O banco fica no Regulus. Fora do Cotuca, conecte a VPN institucional.

Antes da primeira execucao da API, na pasta Back-end/Api, configure a conexao:

```powershell
dotnet user-secrets set CONNECTION_STRING "Server=regulus.cotuca.unicamp.br;Database=CINEJOY;User Id=BD25133;Password=SUA_SENHA;TrustServerCertificate=True;Connect Timeout=10;ConnectRetryCount=0"
```

Troque SUA_SENHA pela senha do banco. Nao coloque a senha no Git.
Essa configuracao e feita uma vez por computador e nao acompanha o clone.
As tabelas ja existem no CINEJOY; nao e necessario recria-las.

Depois, execute dotnet run na pasta da API e npm run dev na pasta frontend,
em terminais separados. npm ci so precisa ser repetido ao instalar ou mudar
as dependencias. Use localhost nas duas partes para manter o login.

Site: http://localhost:3000.
Conexao da API: http://localhost:8080/api/saude.
O pagamento e simulado, sem cobranca real.

