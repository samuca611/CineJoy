using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.Api.Controllers;

[ApiController]
[Route("api/sessoes")]
public class SessoesController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Sessao>> Listar()
    {
        return BancoMemoria.Sessoes;
    }

    [HttpPost]
    public ActionResult<Sessao> Adicionar(Sessao sessao)
    {
        if (!BancoMemoria.Filmes.Any(item => item.Id == sessao.FilmeId))
            return BadRequest("Filme nao encontrado.");
        if (!BancoMemoria.Salas.Any(item => item.Id == sessao.SalaId))
            return BadRequest("Sala nao encontrada.");
        if (string.IsNullOrWhiteSpace(sessao.Data) || string.IsNullOrWhiteSpace(sessao.Horario))
            return BadRequest("Informe a data e o horario.");

        sessao.Id = BancoMemoria.Sessoes.Select(item => item.Id).DefaultIfEmpty(0).Max() + 1;
        BancoMemoria.Sessoes.Add(sessao);
        return sessao;
    }
}

