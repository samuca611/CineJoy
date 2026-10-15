using CineJoy.ApiHenry.Models;

namespace CineJoy.ApiHenry.Data;

public static class BancoFakeHenry
{
    public static List<Unidade> Unidades { get; set; } = [
        new Unidade { Id = 1, Nome = "CineJoy Centro", Cidade = "Campinas" }
    ];

    public static List<Sala> Salas { get; set; } = [
        new Sala { Id = 1, UnidadeId = 1, Numero = "01" }
    ];

    public static List<Funcionario> Funcionarios { get; set; } = [
        new Funcionario { Id = 1, Nome = "Funcionario 1", Email = "funcionario1@cinejoy.com" }
    ];
}

