using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace CineJoy.Api.Models;

public class Sessao
{
    public int Id { get; set; }
    public int FilmeId { get; set; }
    public int SalaId { get; set; }
    [Required, MaxLength(10)]
    public string Data { get; set; } = "";
    [Required, MaxLength(5)]
    public string Horario { get; set; } = "";
    [MaxLength(10)]
    public string Formato { get; set; } = "2D";
    [Range(0.01, 10000)]
    public decimal Preco { get; set; } = 24;
    public bool Ativo { get; set; } = true;
    [NotMapped]
    public string Sala { get; set; } = "";
    [NotMapped]
    public int UnidadeId { get; set; }
    [NotMapped]
    public List<string> AssentosOcupados { get; set; } = [];
}
