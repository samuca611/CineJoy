using System.ComponentModel.DataAnnotations;
namespace CineJoy.Api.Models;

public class Unidade
{
    public int Id { get; set; }
    [Required, MaxLength(100)]
    public string Nome { get; set; } = "";
    [MaxLength(80)]
    public string Cidade { get; set; } = "";
    [MaxLength(10)]
    public string Cep { get; set; } = "";
    [MaxLength(200)]
    public string Endereco { get; set; } = "";
    [MaxLength(100)]
    public string Complemento { get; set; } = "";
    public bool Ativo { get; set; } = true;
}
