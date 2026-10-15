using System.ComponentModel.DataAnnotations;
namespace CineJoy.Api.Models;

public class Pedido
{
    public int Id { get; set; }
    public Guid Chave { get; set; }
    public int UsuarioId { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; }
    [MaxLength(20)]
    public string FormaPagamento { get; set; } = "";
    [MaxLength(20)]
    public string Status { get; set; } = "Pendente";
    public List<ItemPedido> Itens { get; set; } = new List<ItemPedido>();
}

public class ItemPedido
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
    public decimal Preco { get; set; }
}
