using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/funcionarios"), Authorize(Roles = "Funcionario")]
public class FuncionariosController : ControllerBase
{
    private readonly Banco banco;

    public FuncionariosController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        return Ok(await banco.Usuarios.AsNoTracking()
        .Where(x => x.Papel == "Funcionario" && x.Ativo)
        .Select(x => new { x.Id, x.Nome, x.Email }).ToListAsync());
    }
    [HttpPost]
    public async Task<IActionResult> Adicionar(Cadastro dados)
    {
        Usuario usuario = await Contas.Cadastrar(banco, dados, "Funcionario");
        banco.Registrar(User.Identity!.Name!, $"Cadastrou funcionario: {usuario.Nome}");
        await banco.SaveChangesAsync();
        return Ok(Contas.Resumo(usuario));
    }
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Desativar(int id)
    {
        if (id.ToString() == User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return BadRequest(new
            {
                mensagem = "Nao e possivel desativar sua propria conta."
            });
        }

        Usuario? usuario = await banco.Usuarios.FirstOrDefaultAsync(x => x.Id == id && x.Papel == "Funcionario");
        if (usuario == null)
        {
            return NotFound();
        }

        usuario.Ativo = false;
        banco.Registrar(User.Identity!.Name!, $"Desativou funcionario: {usuario.Nome}");
        await banco.SaveChangesAsync();
        return NoContent();
    }
}
