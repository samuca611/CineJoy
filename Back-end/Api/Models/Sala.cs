using System.ComponentModel.DataAnnotations;
namespace CineJoy.Api.Models;

public class Sala
{
    public int Id { get; set; }
    public int UnidadeId { get; set; }
    [Required, MaxLength(10)]
    public string Numero { get; set; } = "";
    public bool Ativo { get; set; } = true;
}
