using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.Api.Controllers;

[ApiController]
[Route("api/unidades")]
public class UnidadesController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Unidade>> Listar()
    {
        return BancoMemoria.Unidades;
    }
}

