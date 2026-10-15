using CineJoy.ApiHenry.Data;
using CineJoy.ApiHenry.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.ApiHenry.Controllers;

[ApiController]
[Route("api/unidades")]
public class UnidadesController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Unidade>> Listar()
    {
        return BancoFakeHenry.Unidades;
    }
}

