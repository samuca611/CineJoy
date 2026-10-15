using CineJoy.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Data;

public static class Catalogo
{
    public static bool DataValida(Sessao sessao) =>
        DateTime.TryParseExact(sessao.Data, new[] { "dd/MM", "dd/MM/yyyy" },
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None, out _) &&
        TimeOnly.TryParseExact(sessao.Horario, "HH:mm", out _);

    public static async Task<List<Filme>> Carregar(Banco banco)
    {
        var filmes = await banco.Filmes.AsNoTracking().Where(x => x.Ativo)
            .Include(x => x.Sessoes.Where(s => s.Ativo)).ToListAsync();
        var salas = await banco.Salas.AsNoTracking().Where(x => x.Ativo).ToListAsync();
        var unidades = await banco.Unidades.Where(x => x.Ativo).Select(x => x.Id).ToListAsync();
        var ingressos = await banco.Ingressos.AsNoTracking().ToListAsync();
        foreach (var filme in filmes)
        {
            filme.Sessoes = filme.Sessoes.Where(s => salas.Any(sala =>
                sala.Id == s.SalaId && unidades.Contains(sala.UnidadeId))).ToList();
            foreach (var sessao in filme.Sessoes)
            {
                var sala = salas.First(x => x.Id == sessao.SalaId);
                sessao.Sala = sala.Numero;
                sessao.UnidadeId = sala.UnidadeId;
                sessao.AssentosOcupados = ingressos.Where(x => x.SessaoId == sessao.Id).Select(x => x.Assento).ToList();
            }
        }
        return filmes;
    }
}
