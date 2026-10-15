using System.Data;
using System.Security.Claims;
using System.Text.RegularExpressions;
using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/pedidos"), Authorize]
public class PedidosController : ControllerBase
{
    private readonly Banco banco;

    public PedidosController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        int id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        bool funcionario = User.IsInRole("Funcionario");
        return Ok(await banco.Pedidos.AsNoTracking().Include(x => x.Itens)
            .Where(x => funcionario || x.UsuarioId == id).OrderByDescending(x => x.Id).ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Comprar(Compra compra)
    {
        int usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (compra.Chave == Guid.Empty)
        {
            return BadRequest(new
            {
                mensagem = "Chave da compra obrigatoria."
            });
        }

        if (compra.FormaPagamento is not ("Pix" or "Cartao" or "Boleto"))
        {
            return BadRequest(new
            {
                mensagem = "Forma de pagamento invalida."
            });
        }

        if (compra.Assentos.Count > 20 || compra.Produtos.Count > 30)
        {
            return BadRequest(new
            {
                mensagem = "Quantidade acima do limite por compra."
            });
        }

        Pedido? existente = await banco.Pedidos.AsNoTracking().FirstOrDefaultAsync(x => x.Chave == compra.Chave);
        if (existente != null)
        {
            return existente.UsuarioId == usuarioId ? Ok(existente) : Conflict();
        }

        // A transacao e o indice unico protegem o estoque e a venda de assentos.
        await using IDbContextTransaction transacao = await banco.Database.BeginTransactionAsync(IsolationLevel.Serializable);
        Pedido pedido = new Pedido
        {
            Chave = compra.Chave,
            UsuarioId = usuarioId,
            FormaPagamento = compra.FormaPagamento,
            Status = compra.SimularPagamento ? "Simulado" : "Pendente"
        };
        List<string> assentos = new List<string>();
        HashSet<string> assentosEscolhidos = new HashSet<string>();
        foreach (string assento in compra.Assentos)
        {
            if (string.IsNullOrWhiteSpace(assento))
            {
                return BadRequest(new
                {
                    mensagem = "Assentos invalidos ou repetidos."
                });
            }

            string numero = assento.Trim().ToUpperInvariant();
            if (!Regex.IsMatch(numero, @"^[A-K]([1-9]|1[0-6])$") || !assentosEscolhidos.Add(numero))
            {
                return BadRequest(new
                {
                    mensagem = "Assentos invalidos ou repetidos."
                });
            }

            assentos.Add(numero);
        }

        Sessao? sessao = null;
        if (assentos.Count > 0)
        {
            sessao = await banco.Sessoes.FirstOrDefaultAsync(s => s.Id == compra.SessaoId && s.Ativo &&
                banco.Filmes.Any(f => f.Id == s.FilmeId && f.Ativo) &&
                banco.Salas.Any(sala => sala.Id == s.SalaId && sala.Ativo &&
                    banco.Unidades.Any(u => u.Id == sala.UnidadeId && u.Ativo)));
            if (sessao == null)
            {
                return BadRequest(new
                {
                    mensagem = "Sessao indisponivel."
                });
            }

            if (await banco.Ingressos.AnyAsync(i => i.SessaoId == sessao.Id && assentos.Contains(i.Assento)))
            {
                return Conflict(new
                {
                    mensagem = "Um dos assentos ja foi comprado. Selecione outros assentos."
                });
            }

            pedido.Total = sessao.Preco * assentos.Count;
        }
        if (assentos.Count == 0 && compra.Produtos.Count == 0)
        {
            return BadRequest(new
            {
                mensagem = "Selecione ingressos ou alimentos."
            });
        }

        Dictionary<int, int> quantidades = new Dictionary<int, int>();
        foreach (ProdutoCompra item in compra.Produtos)
        {
            if (item.Quantidade < 1 || item.Quantidade > 100)
            {
                return BadRequest(new
                {
                    mensagem = "Quantidade invalida."
                });
            }

            quantidades.TryGetValue(item.Id, out int anterior);
            int quantidade = anterior + item.Quantidade;
            if (quantidade > 100)
            {
                return BadRequest(new
                {
                    mensagem = "Quantidade invalida."
                });
            }

            quantidades[item.Id] = quantidade;
        }

        // Mantem a mesma ordem de acesso ao estoque em compras simultaneas.
        List<int> idsProdutos = new List<int>(quantidades.Keys);
        idsProdutos.Sort();
        foreach (int idProduto in idsProdutos)
        {
            int quantidade = quantidades[idProduto];
            Produto? produto = await banco.Produtos.FirstOrDefaultAsync(x => x.Id == idProduto && x.Ativo);
            if (produto == null || produto.Estoque < quantidade)
            {
                return Conflict(new
                {
                    mensagem = "Alimento indisponivel ou estoque insuficiente."
                });
            }

            produto.Estoque -= quantidade;
            pedido.Itens.Add(new ItemPedido { ProdutoId = produto.Id, Quantidade = quantidade, Preco = produto.Preco });
            pedido.Total += produto.Preco * quantidade;
        }
        banco.Pedidos.Add(pedido);
        await banco.SaveChangesAsync();
        foreach (string assento in assentos)
        {
            banco.Ingressos.Add(new Ingresso { PedidoId = pedido.Id, SessaoId = sessao!.Id, Assento = assento, Preco = sessao.Preco });
        }

        await banco.SaveChangesAsync();
        await transacao.CommitAsync();
        return Ok(new
        {
            pedido.Id,
            pedido.Total,
            pedido.Status,
            pedido.FormaPagamento
        });
    }

    [HttpPut("{id:int}/status"), Authorize(Roles = "Funcionario")]
    public async Task<IActionResult> Status(int id, StatusPedido dados)
    {
        if (dados.Status is not ("Pendente" or "Simulado"))
        {
            return BadRequest(new
            {
                mensagem = "Sem gateway, os estados permitidos sao Pendente e Simulado."
            });
        }

        Pedido? pedido = await banco.Pedidos.FindAsync(id);
        if (pedido == null)
        {
            return NotFound();
        }

        pedido.Status = dados.Status;
        banco.Registrar(User.Identity!.Name!, $"Pedido #{id}: {dados.Status}");
        await banco.SaveChangesAsync();
        return Ok(pedido);
    }
}
