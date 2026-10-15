using CineJoy.ApiHenry.Data;
using CineJoy.ApiHenry.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.ApiHenry.Controllers;

[ApiController]
[Route("api/salas")]
public class SalasController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Sala>> Listar()
    {
        return BancoFakeHenry.Salas;
    }
}

