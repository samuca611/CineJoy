using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.Api.Controllers;

[ApiController]
[Route("api/filmes")]
public class FilmesController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Filme>> Listar()
    {
        return BancoMemoria.Filmes;
    }

    [HttpPost]
    public ActionResult<Filme> Adicionar(Filme filme)
    {
        if (string.IsNullOrWhiteSpace(filme.Titulo))
            return BadRequest("Informe o titulo do filme.");

        filme.Id = BancoMemoria.Filmes.Select(item => item.Id).DefaultIfEmpty(0).Max() + 1;
        BancoMemoria.Filmes.Add(filme);
        return filme;
    }
}

