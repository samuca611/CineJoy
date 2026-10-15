namespace CineJoy.Api.Models;

public class Ingresso
{
    public int Id { get; set; }
    public int FilmeId { get; set; }
    public int SessaoId { get; set; }
    public string Assento { get; set; } = "";
    public decimal Preco { get; set; }
}

