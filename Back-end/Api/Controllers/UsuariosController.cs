using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace CineJoy.Api.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly Banco _banco;


    public UsuariosController(Banco banco)
    {
        _banco = banco;
    }

    [HttpPost]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Cadastrar(Cadastro dados)
    {
        var usuario = await Contas.Cadastrar(_banco, dados, "Cliente");
        await Contas.Entrar(HttpContext, usuario);
        
        return Ok(Contas.Resumo(usuario));
    }

    [HttpGet]
    [Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Listar()
    {
        var clientesAtivos = await _banco.Usuarios
            .AsNoTracking()
            .Where(u => u.Papel == "Cliente" && u.Ativo)
            .ToListAsync();

        return Ok(clientesAtivos);
    }


    [HttpGet("localidades")]
    public async Task<IActionResult> Localidades()
    {
        string[] listaEstados = {
            "Acre|AC", "Alagoas|AL", "Amapa|AP", "Amazonas|AM", "Bahia|BA",
            "Ceara|CE", "Distrito Federal|DF", "Espirito Santo|ES", "Goias|GO", "Maranhao|MA",
            "Mato Grosso|MT", "Mato Grosso do Sul|MS", "Minas Gerais|MG", "Para|PA", "Paraiba|PB",
            "Parana|PR", "Pernambuco|PE", "Piaui|PI", "Rio de Janeiro|RJ", "Rio Grande do Norte|RN",
            "Rio Grande do Sul|RS", "Rondonia|RO", "Roraima|RR", "Santa Catarina|SC", "Sao Paulo|SP",
            "Sergipe|SE", "Tocantins|TO"
        };

        var estados = listaEstados
            .Select((item, index) => new {
                id = index + 1,
                nome = item.Split('|')[0],
                sigla = item.Split('|')[1]
            })
            .ToList();

        var cidadesDoBanco = await _banco.Usuarios
            .AsNoTracking()
            .Where(u => u.CidadeNome != "")
            .Select(u => new { u.CidadeNome, u.EstadoSigla })
            .Distinct()
            .ToListAsync();

        var cidades = cidadesDoBanco.Select((cidade, index) => new {
            id = index + 1,
            nome = cidade.CidadeNome,
            estadoId = estados.Find(e => e.sigla == cidade.EstadoSigla)?.id ?? 0
        });

        return Ok(new { estados, cidades });
    }
}