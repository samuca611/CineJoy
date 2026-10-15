using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.Api.Controllers;

[ApiController]
[Route("api/salas")]
public class SalasController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Sala>> Listar()
    {
        return BancoMemoria.Salas;
    }

    [HttpPost]
    public ActionResult<Sala> Adicionar(Sala sala)
    {
        if (!BancoMemoria.Unidades.Any(item => item.Id == sala.UnidadeId))
            return BadRequest("Unidade nao encontrada.");
        if (string.IsNullOrWhiteSpace(sala.Numero))
            return BadRequest("Informe o numero da sala.");

        sala.Id = BancoMemoria.Salas.Select(item => item.Id).DefaultIfEmpty(0).Max() + 1;
        BancoMemoria.Salas.Add(sala);
        return sala;
    }
}

