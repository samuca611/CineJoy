using CineJoy.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/logs"), Authorize(Roles = "Funcionario")]
public class LogsController : ControllerBase
{
    private readonly Banco banco;

    public LogsController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        return Ok(await banco.Logs.AsNoTracking()
        .OrderByDescending(x => x.Id).Take(200)
        .Select(x => new { x.Id, x.Funcionario, x.Tarefa, status = "Concluido", x.Data }).ToListAsync());
    }
}
