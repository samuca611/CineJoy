# Backend CineJoy

Uma API C# para as partes do grupo. Os arquivos da Giovana devem entrar nas
mesmas pastas Controllers, Models e Data, usando o namespace CineJoy.Api.
Confira arquivos com o mesmo nome antes de copiar, principalmente Program.cs.

- Api/Controllers: rotas HTTP.
- Api/Models: classes dos dados.
- Api/Data/BancoMemoria.cs: listas compartilhadas para os testes.
- database: scripts de criacao das tabelas no SQL Server.

## Executar

Na pasta Api, execute `dotnet run`. A porta padrao e 8080.
Para mudar, configure a variavel PORTA antes de iniciar.

GET /api/filmes, /api/unidades, /api/salas, /api/sessoes,
/api/ingressos e /api/funcionarios listam os dados.
POST esta disponivel para filmes, salas, sessoes e ingressos.

Para adicionar uma sessao, envie:

```json
{ "filmeId": 1, "salaId": 1, "data": "14/10", "horario": "19:00" }
```

Para comprar um ingresso, envie:

```json
{ "sessaoId": 1, "assento": "A01" }
```

A API consulta a sessao para definir o filme. O preco de teste e R$ 25.
Uma sala precisa de unidade existente. Uma sessao precisa de filme e sala
existentes. Um assento nao pode ser vendido duas vezes na mesma sessao
em compras sequenciais. As listas ainda nao tratam compras simultaneas.

## Etapa atual

Os dados ficam em memoria e as alteracoes somem ao reiniciar a API.
O frontend ainda usa seu api.js local; ele nao consulta esta API.
Login real, autorizacao de funcionarios e conexao SQL ainda precisam ser implementados.

Os arquivos em docs/exemplos-next sao exemplos antigos e nao participam da execucao.

## SQL Server

Para um banco novo, executar primeiro henry-unidades-salas-funcionarios.sql,
depois samuel-filmes-sessoes-ingressos.sql.
O segundo script usa idSala nas sessoes e idSessao nos ingressos.
Os scripts nao alteram tabelas existentes: se ja houver tabelas antigas,
sera necessario preparar uma migracao antes.

Nenhum script foi executado no Regulus nesta organizacao.
Ainda falta implementar a leitura e gravacao SQL no codigo.
Nao salvar senhas no repositorio.
