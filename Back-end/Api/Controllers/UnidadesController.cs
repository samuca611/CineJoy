using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/unidades")]
public class UnidadesController : ControllerBase
{
    private readonly Banco banco;

    public UnidadesController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        return Ok(await banco.Unidades.AsNoTracking().Where(x => x.Ativo).ToListAsync());
    }
    [HttpPost, Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Adicionar(Unidade unidade)
    {
        unidade.Id = 0;
        unidade.Ativo = true;
        banco.Unidades.Add(unidade);
        banco.Registrar(User.Identity!.Name!, $"Adicionou unidade: {unidade.Nome}");
        await banco.SaveChangesAsync();
        return Ok(unidade);
    }
    [HttpPut("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Editar(int id, Unidade unidade)
    {
        Unidade? atual = await banco.Unidades.FindAsync(id);
        if (atual == null)
        {
            return NotFound();
        }

        unidade.Id = id;
        unidade.Ativo = true;
        banco.Entry(atual).CurrentValues.SetValues(unidade);
        banco.Registrar(User.Identity!.Name!, $"Editou unidade: {unidade.Nome}");
        await banco.SaveChangesAsync();
        return Ok(atual);
    }
    [HttpDelete("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Excluir(int id)
    {
        Unidade? unidade = await banco.Unidades.FindAsync(id);
        if (unidade == null)
        {
            return NotFound();
        }

        unidade.Ativo = false;
        banco.Registrar(User.Identity!.Name!, $"Desativou unidade: {unidade.Nome}");
        await banco.SaveChangesAsync();
        return NoContent();
    }
}
