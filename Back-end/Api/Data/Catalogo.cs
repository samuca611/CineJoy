using CineJoy.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Data;

public static class Catalogo
{
    public static bool DataValida(Sessao sessao)
    {
        return DateTime.TryParseExact(sessao.Data, new[] { "dd/MM", "dd/MM/yyyy" },
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None, out _) &&
        TimeOnly.TryParseExact(sessao.Horario, "HH:mm", out _);
    }

    public static async Task<List<Filme>> Carregar(Banco banco)
    {
        List<Filme> filmes = await banco.Filmes.AsNoTracking().Where(x => x.Ativo)
            .Include(x => x.Sessoes.Where(s => s.Ativo)).ToListAsync();
        List<Sala> salas = await banco.Salas.AsNoTracking().Where(x => x.Ativo).ToListAsync();
        List<int> unidades = await banco.Unidades.Where(x => x.Ativo).Select(x => x.Id).ToListAsync();
        List<Ingresso> ingressos = await banco.Ingressos.AsNoTracking().ToListAsync();

        return Organizar(filmes, salas, unidades, ingressos);
    }

    public static List<Filme> Organizar(List<Filme> filmes, List<Sala> salas,
        List<int> unidades, List<Ingresso> ingressos)
    {
        HashSet<int> unidadesAtivas = new HashSet<int>(unidades);
        Dictionary<int, Sala> salasPorId = new Dictionary<int, Sala>();
        Dictionary<int, List<string>> assentosPorSessao = new Dictionary<int, List<string>>();

        foreach (Sala sala in salas)
        {
            if (sala.Ativo && unidadesAtivas.Contains(sala.UnidadeId))
            {
                salasPorId.Add(sala.Id, sala);
            }
        }

        foreach (Ingresso ingresso in ingressos)
        {
            if (!assentosPorSessao.TryGetValue(ingresso.SessaoId, out List<string>? assentos))
            {
                assentos = new List<string>();
                assentosPorSessao.Add(ingresso.SessaoId, assentos);
            }
            assentos.Add(ingresso.Assento);
        }

        foreach (Filme filme in filmes)
        {
            List<Sessao> sessoesDisponiveis = new List<Sessao>();
            foreach (Sessao sessao in filme.Sessoes)
            {
                if (!sessao.Ativo || !salasPorId.TryGetValue(sessao.SalaId, out Sala? sala))
                {
                    continue;
                }

                sessao.Sala = sala.Numero;
                sessao.UnidadeId = sala.UnidadeId;
                if (assentosPorSessao.TryGetValue(sessao.Id, out List<string>? assentos))
                {
                    sessao.AssentosOcupados = new List<string>(assentos);
                }
                else
                {
                    sessao.AssentosOcupados = new List<string>();
                }

                sessoesDisponiveis.Add(sessao);
            }
            filme.Sessoes = sessoesDisponiveis;
        }
        return filmes;
    }
}
