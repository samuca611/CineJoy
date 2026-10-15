using CineJoy.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/ingressos"), Authorize]
public class IngressosController : ControllerBase
{
    private readonly Banco banco;

    public IngressosController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        int usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        bool funcionario = User.IsInRole("Funcionario");
        var lista = await (
            from ingresso in banco.Ingressos.AsNoTracking()
            join pedido in banco.Pedidos on ingresso.PedidoId equals pedido.Id
            join usuario in banco.Usuarios on pedido.UsuarioId equals usuario.Id
            join sessao in banco.Sessoes on ingresso.SessaoId equals sessao.Id
            join filme in banco.Filmes on sessao.FilmeId equals filme.Id
            join sala in banco.Salas on sessao.SalaId equals sala.Id
            join unidade in banco.Unidades on sala.UnidadeId equals unidade.Id
            where funcionario || pedido.UsuarioId == usuarioId
            orderby ingresso.Id descending
            select new
            {
                ingresso.Id,
                ingresso.PedidoId,
                usuario = usuario.Nome,
                filme = filme.Titulo,
                ingresso.Assento,
                ingresso.Preco,
                pedido.Status,
                unidade = unidade.Nome + " - Sala " + sala.Numero + " - Sessao " + sessao.Id,
                comida = string.Join(", ", banco.ItensPedido.Where(i => i.PedidoId == pedido.Id)
                    .Join(banco.Produtos, i => i.ProdutoId, p => p.Id, (i, p) => p.Nome))
            }).ToListAsync();
        return Ok(lista);
    }
}
