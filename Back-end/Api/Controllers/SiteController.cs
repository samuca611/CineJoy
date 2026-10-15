using CineJoy.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/site")]
public class SiteController(Banco banco) : ControllerBase
{
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
