using System.ComponentModel.DataAnnotations;
namespace CineJoy.Api.Models;

public class Filme
{
    public int Id { get; set; }
    [Required, MaxLength(150)] public string Titulo { get; set; } = "";
    [MaxLength(80)] public string Genero { get; set; } = "";
    [MaxLength(5)] public string Classificacao { get; set; } = "L";
    [MaxLength(30)] public string Duracao { get; set; } = "";
    [MaxLength(2000)] public string Descricao { get; set; } = "";
    [MaxLength(150)] public string Direcao { get; set; } = "";
    [MaxLength(500)] public string Elenco { get; set; } = "";
    [MaxLength(1000)] public string Imagem { get; set; } = "";
    [MaxLength(1000)] public string PosterCatalogo { get; set; } = "";
    public bool Ativo { get; set; } = true;
    public List<Sessao> Sessoes { get; set; } = [];
}
