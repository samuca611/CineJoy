using System.ComponentModel.DataAnnotations;
namespace CineJoy.Api.Models;

public class Log
{
    public int Id { get; set; }
    [MaxLength(100)]
    public string Funcionario { get; set; } = "";
    [MaxLength(300)]
    public string Tarefa { get; set; } = "";
    public DateTime Data { get; set; } = DateTime.UtcNow;
}
