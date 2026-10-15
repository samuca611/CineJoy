using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.Api.Controllers;

[ApiController]
[Route("api/funcionarios")]
public class FuncionariosController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Funcionario>> Listar()
    {
        return BancoMemoria.Funcionarios;
    }
}

