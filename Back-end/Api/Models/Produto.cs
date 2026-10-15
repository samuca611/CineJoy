using System.ComponentModel.DataAnnotations;
namespace CineJoy.Api.Models;

public class Produto
{
    public int Id { get; set; }
    [Required, MaxLength(100)]
    public string Nome { get; set; } = "";
    [MaxLength(500)]
    public string Descricao { get; set; } = "";
    [Range(0.01, 10000)]
    public decimal Preco { get; set; }
    [Range(0, 100000)]
    public int Estoque { get; set; }
    [MaxLength(1000)]
    public string Imagem { get; set; } = "";
    public bool Ativo { get; set; } = true;
}
