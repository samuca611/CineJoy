namespace CineJoy.Api.Models;

public class Sessao
{
    public int Id { get; set; }
    public int FilmeId { get; set; }
    public string Data { get; set; } = "";
    public string Horario { get; set; } = "";
    public int SalaId { get; set; }
}

