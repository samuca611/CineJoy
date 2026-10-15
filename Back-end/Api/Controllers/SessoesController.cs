using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/sessoes")]
public class SessoesController : ControllerBase
{
    private readonly Banco banco;

    public SessoesController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        return Ok((await Catalogo.Carregar(banco)).SelectMany(x => x.Sessoes));
    }
    [HttpGet("{id:int}/assentos")]
    public async Task<IActionResult> Assentos(int id)
    {
        return Ok(await banco.Ingressos.AsNoTracking()
        .Where(x => x.SessaoId == id).Select(x => x.Assento).ToListAsync());
    }

    [HttpPost, Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Adicionar(Sessao sessao)
    {
        if (!await Valida(sessao))
        {
            return BadRequest(new
            {
                mensagem = "Filme ou sala indisponivel."
            });
        }

        sessao.Id = 0;
        sessao.Ativo = true;
        banco.Sessoes.Add(sessao);
        banco.Registrar(User.Identity!.Name!, "Adicionou sessao");
        await banco.SaveChangesAsync();
        return Ok(sessao);
    }
    [HttpPut("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Editar(int id, Sessao sessao)
    {
        Sessao? atual = await banco.Sessoes.FindAsync(id);
        if (atual == null)
        {
            return NotFound();
        }

        if (await banco.Ingressos.AnyAsync(x => x.SessaoId == id))
        {
            return Conflict(new
            {
                mensagem = "Sessao com ingressos vendidos nao pode ser alterada."
            });
        }

        if (!await Valida(sessao))
        {
            return BadRequest(new
            {
                mensagem = "Filme ou sala indisponivel."
            });
        }

        sessao.Id = id;
        sessao.Ativo = true;
        banco.Entry(atual).CurrentValues.SetValues(sessao);
        banco.Registrar(User.Identity!.Name!, "Editou sessao");
        await banco.SaveChangesAsync();
        return Ok(atual);
    }
    [HttpDelete("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Excluir(int id)
    {
        Sessao? sessao = await banco.Sessoes.FindAsync(id);
        if (sessao == null)
        {
            return NotFound();
        }

        sessao.Ativo = false;
        banco.Registrar(User.Identity!.Name!, "Desativou sessao");
        await banco.SaveChangesAsync();
        return NoContent();
    }
    private async Task<bool> Valida(Sessao s)
    {
        return Catalogo.DataValida(s) &&
        await banco.Filmes.AnyAsync(f => f.Id == s.FilmeId && f.Ativo) &&
        await banco.Salas.AnyAsync(sala => sala.Id == s.SalaId && sala.Ativo &&
            banco.Unidades.Any(u => u.Id == sala.UnidadeId && u.Ativo));
    }
}
