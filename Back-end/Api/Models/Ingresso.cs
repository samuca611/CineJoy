using System.ComponentModel.DataAnnotations;
namespace CineJoy.Api.Models;

public class Ingresso
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public int SessaoId { get; set; }
    [MaxLength(5)]
    public string Assento { get; set; } = "";
    public decimal Preco { get; set; }
}
