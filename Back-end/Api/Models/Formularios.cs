using System.ComponentModel.DataAnnotations;
namespace CineJoy.Api.Models;

public class Cadastro
{
    [Required, RegularExpression(@"^\d{11}$")]
    public string Cpf { get; set; } = "";
    [Required, MaxLength(100)]
    public string Nome { get; set; } = "";
    [Required, EmailAddress, MaxLength(100)]
    public string Email { get; set; } = "";
    [Required, MaxLength(30)]
    public string UserLogin { get; set; } = "";
    [Required, MinLength(6), MaxLength(100)]
    public string Senha { get; set; } = "";
    public DateTime DataNascimento { get; set; }
    [MaxLength(15)]
    public string Telefone { get; set; } = "";
    [Required, MaxLength(80)]
    public string EstadoNome { get; set; } = "";
    [Required, RegularExpression(@"^[A-Za-z]{2}$")]
    public string EstadoSigla { get; set; } = "";
    [Required, MaxLength(80)]
    public string CidadeNome { get; set; } = "";
}
public class Login
{
    [Required, MaxLength(100)]
    public string Email { get; set; } = "";
    [Required, MaxLength(100)]
    public string Senha { get; set; } = "";
}
public class EditarConta
{
    [Required, MaxLength(100)]
    public string Nome { get; set; } = "";
    public DateTime DataNascimento { get; set; }
    [MaxLength(11), RegularExpression(@"^\d{10,11}$")]
    public string Telefone { get; set; } = "";
    [Required, MaxLength(80)]
    public string EstadoNome { get; set; } = "";
    [Required, RegularExpression(@"^[A-Za-z]{2}$")]
    public string EstadoSigla { get; set; } = "";
    [Required, MaxLength(80)]
    public string CidadeNome { get; set; } = "";
}
public class Compra
{
    public Guid Chave { get; set; }
    public int? SessaoId { get; set; }
    public List<string> Assentos { get; set; } = new List<string>();
    public List<ProdutoCompra> Produtos { get; set; } = new List<ProdutoCompra>();
    [Required, MaxLength(20)]
    public string FormaPagamento { get; set; } = "";
    public bool SimularPagamento { get; set; }
}
public class ProdutoCompra
{
    public int Id { get; set; }
    [Range(1, 100)]
    public int Quantidade { get; set; }
}
public class StatusPedido
{
    [Required]
    public string Status { get; set; } = "";
}
