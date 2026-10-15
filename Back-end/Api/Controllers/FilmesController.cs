using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/filmes")]
public class FilmesController : ControllerBase
{
    private readonly Banco banco;

    public FilmesController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        return Ok(await Catalogo.Carregar(banco));
    }

    [HttpPost, Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Adicionar(Filme filme)
    {
        await using IDbContextTransaction transacao = await banco.Database.BeginTransactionAsync();
        List<Sessao> sessoes = filme.Sessoes.ToList();
        filme.Id = 0;
        filme.Ativo = true;
        filme.Sessoes = new List<Sessao>();
        banco.Filmes.Add(filme);
        await banco.SaveChangesAsync();
        foreach (Sessao? sessao in sessoes)
        {
            if (!await SalaValida(sessao.SalaId) || !Catalogo.DataValida(sessao))
            {
                return BadRequest(new
                {
                    mensagem = "Selecione uma sala cadastrada, data DD/MM/AAAA e horario HH:mm validos."
                });
            }

            sessao.Id = 0;
            sessao.FilmeId = filme.Id;
            sessao.Ativo = true;
            banco.Sessoes.Add(sessao);
        }
        banco.Registrar(User.Identity!.Name!, $"Adicionou filme: {filme.Titulo}");
        await banco.SaveChangesAsync();
        await transacao.CommitAsync();
        return Ok(filme);
    }

    [HttpPut("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Editar(int id, Filme filme)
    {
        Filme? atual = await banco.Filmes.Include(x => x.Sessoes).FirstOrDefaultAsync(x => x.Id == id && x.Ativo);
        if (atual == null)
        {
            return NotFound();
        }

        await using IDbContextTransaction transacao = await banco.Database.BeginTransactionAsync();
        List<Sessao> antigas = atual.Sessoes.ToList();
        foreach (Sessao? antiga in antigas)
        {
            Sessao? nova = filme.Sessoes.Find(x => x.Id == antiga.Id);
            bool temVenda = await banco.Ingressos.AnyAsync(x => x.SessaoId == antiga.Id);
            if (temVenda && (nova == null || nova.SalaId != antiga.SalaId || nova.Data != antiga.Data || nova.Horario != antiga.Horario))
            {
                return Conflict(new
                {
                    mensagem = "Uma sessao com ingressos vendidos nao pode ser removida ou remarcada."
                });
            }

            if (nova == null)
            {
                antiga.Ativo = false;
            }
        }
        foreach (Sessao sessao in filme.Sessoes)
        {
            if (!await SalaValida(sessao.SalaId) || !Catalogo.DataValida(sessao))
            {
                return BadRequest(new
                {
                    mensagem = "Sala, data ou horario invalidos."
                });
            }

            Sessao? antiga = antigas.Find(x => x.Id == sessao.Id);
            sessao.FilmeId = id;
            sessao.Ativo = true;
            if (antiga == null)
            {
                sessao.Id = 0;
                banco.Sessoes.Add(sessao);
            }
            else
            {
                banco.Entry(antiga).CurrentValues.SetValues(sessao);
            }
        }
        filme.Id = id;
        filme.Ativo = true;
        banco.Entry(atual).CurrentValues.SetValues(filme);
        banco.Registrar(User.Identity!.Name!, $"Editou filme: {filme.Titulo}");
        await banco.SaveChangesAsync();
        await transacao.CommitAsync();
        return Ok(filme);
    }

    [HttpDelete("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Excluir(int id)
    {
        Filme? filme = await banco.Filmes.FindAsync(id);
        if (filme == null)
        {
            return NotFound();
        }

        filme.Ativo = false;
        banco.Registrar(User.Identity!.Name!, $"Desativou filme: {filme.Titulo}");
        await banco.SaveChangesAsync();
        return NoContent();
    }

    private Task<bool> SalaValida(int id)
    {
        return banco.Salas.AnyAsync(s => s.Id == id && s.Ativo &&
        banco.Unidades.Any(u => u.Id == s.UnidadeId && u.Ativo));
    }
}
