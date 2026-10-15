using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly Banco banco;

    public UsuariosController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpPost, EnableRateLimiting("login")]
    public async Task<IActionResult> Cadastrar(Cadastro dados)
    {
        Usuario usuario = await Contas.Cadastrar(banco, dados, "Cliente");
        await Contas.Entrar(HttpContext, usuario);
        return Ok(Contas.Resumo(usuario));
    }

    [HttpGet, Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Listar()
    {
        return Ok(await banco.Usuarios.AsNoTracking()
        .Where(x => x.Papel == "Cliente" && x.Ativo).ToListAsync());
    }

    [HttpGet("localidades")]
    public async Task<IActionResult> Localidades()
    {
        string[] nomes = new[] { "Acre|AC", "Alagoas|AL", "Amapa|AP", "Amazonas|AM", "Bahia|BA",
            "Ceara|CE", "Distrito Federal|DF", "Espirito Santo|ES", "Goias|GO", "Maranhao|MA",
            "Mato Grosso|MT", "Mato Grosso do Sul|MS", "Minas Gerais|MG", "Para|PA", "Paraiba|PB",
            "Parana|PR", "Pernambuco|PE", "Piaui|PI", "Rio de Janeiro|RJ", "Rio Grande do Norte|RN",
            "Rio Grande do Sul|RS", "Rondonia|RO", "Roraima|RR", "Santa Catarina|SC", "Sao Paulo|SP",
            "Sergipe|SE", "Tocantins|TO" };
        var estados = nomes.Select((nome, i) => new { id = i + 1, nome = nome.Split('|')[0], sigla = nome.Split('|')[1] }).ToList();
        var locais = await banco.Usuarios.AsNoTracking().Where(x => x.CidadeNome != "")
            .Select(x => new { x.CidadeNome, x.EstadoSigla }).Distinct().ToListAsync();
        var cidades = locais.Select((x, i) => new
        {
            id = i + 1,
            nome = x.CidadeNome,
            estadoId = estados.Find(e => e.sigla == x.EstadoSigla)?.id ?? 0
        });
        return Ok(new
        {
            estados,
            cidades
        });
    }
}
