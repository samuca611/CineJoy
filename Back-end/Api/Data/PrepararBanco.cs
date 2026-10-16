using CineJoy.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Data.Common;

namespace CineJoy.Api.Data;

public static class PrepararBanco
{
    public static async Task Executar(Banco banco, IConfiguration config, string[] args)
    {
        if (args.Contains("--gerar-sql"))
        {
            Console.WriteLine(banco.Database.GenerateCreateScript());
            return;
        }
        await banco.Database.OpenConnectionAsync();
        DbConnection conexao = banco.Database.GetDbConnection();
        if (args.Contains("--verificar-banco"))
        {
            using DbCommand comando = conexao.CreateCommand();
            comando.CommandText = "SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_SCHEMA, TABLE_NAME";
            using DbDataReader leitor = await comando.ExecuteReaderAsync();
            while (await leitor.ReadAsync())
            {
                Console.WriteLine($"{leitor.GetString(0)}.{leitor.GetString(1)}");
            }

            return;
        }

        // Cria apenas o esquema do site. Nao altera as tabelas do aplicativo.
        await using IDbContextTransaction transacao = await banco.Database.BeginTransactionAsync(IsolationLevel.Serializable);
        using DbCommand verificar = conexao.CreateCommand();
        verificar.Transaction = transacao.GetDbTransaction();
        verificar.CommandText = "SELECT COUNT(*) FROM sys.tables t JOIN sys.schemas s ON s.schema_id=t.schema_id WHERE s.name='CineJoyWeb'";
        int quantidade = Convert.ToInt32(await verificar.ExecuteScalarAsync());
        if (quantidade == 0)
        {
            await banco.GetService<IRelationalDatabaseCreator>().CreateTablesAsync();
        }
        else
        {
            Console.WriteLine("Esquema existente preservado. Confira futuras alteracoes com uma migracao.");
        }

        string? email = config["EMAIL_FUNCIONARIO"];
        string? senha = config["SENHA_FUNCIONARIO"];
        if (!string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(senha))
        {
            email = email.Trim().ToLowerInvariant();
            if (!await banco.Usuarios.AnyAsync(x => x.Email == email))
            {
                if (senha.Length < 6)
                {
                    throw new InvalidOperationException("Senha do funcionario precisa ter 6 caracteres.");
                }

                Usuario funcionario = new Usuario
                {
                    Cpf = "00000000000",
                    Nome = "Funcionario 1",
                    Email = email,
                    UserLogin = email,
                    Papel = "Funcionario",
                    DataNascimento = new DateTime(2000, 1, 1)
                };
                funcionario.SenhaHash = new PasswordHasher<Usuario>().HashPassword(funcionario, senha);
                banco.Usuarios.Add(funcionario);
                await banco.SaveChangesAsync();
            }
        }
        await transacao.CommitAsync();
        Console.WriteLine("Tabelas do site preparadas. Nenhum filme, produto ou unidade foi inserido automaticamente.");
    }
}
