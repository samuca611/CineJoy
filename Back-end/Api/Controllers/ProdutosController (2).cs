using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/produtos")]
public class ProdutosController : ControllerBase
{
    private readonly Banco banco;

    public ProdutosController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        return Ok(await banco.Produtos.AsNoTracking().Where(x => x.Ativo).ToListAsync());
    }
    [HttpPost, Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Adicionar(Produto produto)
    {
        produto.Id = 0;
        produto.Ativo = true;
        banco.Produtos.Add(produto);
        banco.Registrar(User.Identity!.Name!, $"Adicionou alimento: {produto.Nome}");
        await banco.SaveChangesAsync();
        return Ok(produto);
    }
    [HttpPut("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Editar(int id, Produto produto)
    {
        Produto? atual = await banco.Produtos.FindAsync(id);
        if (atual == null)
        {
            return NotFound();
        }

        produto.Id = id;
        produto.Ativo = true;
        banco.Entry(atual).CurrentValues.SetValues(produto);
        banco.Registrar(User.Identity!.Name!, $"Editou alimento: {produto.Nome}");
        await banco.SaveChangesAsync();
        return Ok(atual);
    }
    [HttpDelete("{id:int}"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Excluir(int id)
    {
        Produto? produto = await banco.Produtos.FindAsync(id);
        if (produto == null)
        {
            return NotFound();
        }

        produto.Ativo = false;
        banco.Registrar(User.Identity!.Name!, $"Desativou alimento: {produto.Nome}");
        await banco.SaveChangesAsync();
        return NoContent();
    }
}
