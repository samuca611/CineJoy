using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace CineJoy.Api.Models;

public class Usuario
{
    public int Id { get; set; }
    public bool Ativo { get; set; } = true;
    [MaxLength(11)]
    public string Cpf { get; set; } = "";
    [MaxLength(100)]
    public string Nome { get; set; } = "";
    [MaxLength(100)]
    public string Email { get; set; } = "";
    [MaxLength(30)]
    public string UserLogin { get; set; } = "";
    public DateTime DataNascimento { get; set; }
    [MaxLength(15)]
    public string Telefone { get; set; } = "";
    [MaxLength(80)]
    public string EstadoNome { get; set; } = "";
    [MaxLength(2)]
    public string EstadoSigla { get; set; } = "";
    [MaxLength(80)]
    public string CidadeNome { get; set; } = "";
    [JsonIgnore, MaxLength(500)]
    public string SenhaHash { get; set; } = "";
    [MaxLength(20)]
    public string Papel { get; set; } = "Cliente";
}
