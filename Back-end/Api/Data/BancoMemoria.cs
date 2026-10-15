using CineJoy.Api.Models;

namespace CineJoy.Api.Data;

// Dados de teste compartilhados pela API. Reiniciar a API apaga as alteracoes.
public static class BancoMemoria
{
    public static List<Unidade> Unidades { get; } = [
        new Unidade { Id = 1, Nome = "CineJoy Centro", Cidade = "Campinas" }
    ];
    public static List<Sala> Salas { get; } = [
        new Sala { Id = 1, UnidadeId = 1, Numero = "01" },
        new Sala { Id = 2, UnidadeId = 1, Numero = "02" }
    ];
    public static List<Funcionario> Funcionarios { get; } = [
        new Funcionario { Id = 1, Nome = "Funcionario 1", Email = "funcionario1@cinejoy.com" }
    ];
    public static List<Filme> Filmes { get; } = [
        new Filme { Id = 1, Titulo = "Minions e Monstros", Genero = "Animacao", Classificacao = "L" },
        new Filme { Id = 2, Titulo = "Homem Aranha: Um novo dia", Genero = "Acao", Classificacao = "12" },
        new Filme { Id = 3, Titulo = "A Odisseia", Genero = "Aventura", Classificacao = "12" }
    ];
    public static List<Sessao> Sessoes { get; } = [
        new Sessao { Id = 1, FilmeId = 1, SalaId = 1, Data = "25/09", Horario = "16:00" },
        new Sessao { Id = 2, FilmeId = 2, SalaId = 1, Data = "25/09", Horario = "19:00" },
        new Sessao { Id = 3, FilmeId = 3, SalaId = 2, Data = "26/09", Horario = "20:00" }
    ];
    public static List<Ingresso> Ingressos { get; } = [];
}
