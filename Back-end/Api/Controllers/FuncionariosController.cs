using CineJoy.ApiHenry.Data;
using CineJoy.ApiHenry.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.ApiHenry.Controllers;

[ApiController]
[Route("api/funcionarios")]
public class FuncionariosController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Funcionario>> Listar()
    {
        return BancoFakeHenry.Funcionarios;
    }
}

