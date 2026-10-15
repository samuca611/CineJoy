using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace CineJoy.Api.Controllers;

[ApiController]
[Route("api/ingressos")]
public class IngressosController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Ingresso>> Listar()
    {
        return BancoMemoria.Ingressos;
    }

    [HttpPost]
    public ActionResult<Ingresso> Comprar(Ingresso ingresso)
    {
        var sessao = BancoMemoria.Sessoes.Find(item => item.Id == ingresso.SessaoId);
        if (sessao == null)
            return BadRequest("Sessao nao encontrada.");
        if (string.IsNullOrWhiteSpace(ingresso.Assento))
            return BadRequest("Informe o assento.");

        ingresso.Assento = ingresso.Assento.Trim().ToUpperInvariant();
        if (BancoMemoria.Ingressos.Any(item =>
            item.SessaoId == ingresso.SessaoId && item.Assento == ingresso.Assento))
            return Conflict("Assento ja comprado nesta sessao.");

        ingresso.Id = BancoMemoria.Ingressos.Select(item => item.Id).DefaultIfEmpty(0).Max() + 1;
        ingresso.FilmeId = sessao.FilmeId;
        ingresso.Preco = 25;
        BancoMemoria.Ingressos.Add(ingresso);
        return ingresso;
    }
}

