using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/salas")]
public class SalasController : ControllerBase
{
    private readonly Banco banco;

    public SalasController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        return Ok(await banco.Salas.AsNoTracking().Where(x => x.Ativo).ToListAsync());
    }
    [HttpPost, Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Adicionar(Sala sala)
    {
        if (!await banco.Unidades.AnyAsync(x => x.Id == sala.UnidadeId && x.Ativo))
        {
            return BadRequest(new
            {
                mensagem = "Unidade nao encontrada."
            });
        }

        sala.Id = 0;
        sala.Ativo = true;
        banco.Salas.Add(sala);
        banco.Registrar(User.Identity!.Name!, $"Adicionou sala: {sala.Numero}");
        await banco.SaveChangesAsync();
        return Ok(sala);
    }
    [HttpPut("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Editar(int id, Sala sala)
    {
        Sala? atual = await banco.Salas.FindAsync(id);
        if (atual == null)
        {
            return NotFound();
        }

        if (await banco.Sessoes.AnyAsync(s => s.SalaId == id && banco.Ingressos.Any(i => i.SessaoId == s.Id)) &&
            (atual.UnidadeId != sala.UnidadeId || atual.Numero != sala.Numero))
        {
            return Conflict(new
            {
                mensagem = "Sala com vendas nao pode mudar de unidade ou numero."
            });
        }

        if (!await banco.Unidades.AnyAsync(x => x.Id == sala.UnidadeId && x.Ativo))
        {
            return BadRequest(new
            {
                mensagem = "Unidade nao encontrada."
            });
        }

        sala.Id = id;
        sala.Ativo = true;
        banco.Entry(atual).CurrentValues.SetValues(sala);
        banco.Registrar(User.Identity!.Name!, $"Editou sala: {sala.Numero}");
        await banco.SaveChangesAsync();
        return Ok(atual);
    }
    [HttpDelete("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Excluir(int id)
    {
        Sala? sala = await banco.Salas.FindAsync(id);
        if (sala == null)
        {
            return NotFound();
        }

        sala.Ativo = false;
        banco.Registrar(User.Identity!.Name!, $"Desativou sala: {sala.Numero}");
        await banco.SaveChangesAsync();
        return NoContent();
    }
}
