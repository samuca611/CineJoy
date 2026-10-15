using CineJoy.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/site")]
public class SiteController : ControllerBase
{
    private readonly Banco banco;

    public SiteController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet("home")]
    public async Task<IActionResult> Home()
    {
        return Ok(new {
            filmes = await Catalogo.Carregar(banco),
            produtos = await banco.Produtos.AsNoTracking().Where(x => x.Ativo).ToListAsync(),
            unidades = await banco.Unidades.AsNoTracking().Where(x => x.Ativo).ToListAsync()
        });
    }
}
