using CineJoy.Api.Models;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Data;

public class Banco : DbContext
{
    public Banco(DbContextOptions<Banco> options) : base(options)
    {
    }

    public DbSet<Filme> Filmes => Set<Filme>();
    public DbSet<Sessao> Sessoes => Set<Sessao>();
    public DbSet<Unidade> Unidades => Set<Unidade>();
    public DbSet<Sala> Salas => Set<Sala>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<Ingresso> Ingressos => Set<Ingresso>();
    public DbSet<ItemPedido> ItensPedido => Set<ItemPedido>();
    public DbSet<Log> Logs => Set<Log>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.HasDefaultSchema("CineJoyWeb");
        model.Entity<Usuario>().HasIndex(x => x.Email).IsUnique();
        model.Entity<Usuario>().HasIndex(x => x.Cpf).IsUnique();
        model.Entity<Usuario>().HasIndex(x => x.UserLogin).IsUnique();
        model.Entity<Pedido>().HasIndex(x => x.Chave).IsUnique();
        model.Entity<Sala>().HasIndex(x => new { x.UnidadeId, x.Numero }).IsUnique();
        model.Entity<Ingresso>().HasIndex(x => new { x.SessaoId, x.Assento }).IsUnique();
        model.Entity<Filme>().HasMany(x => x.Sessoes).WithOne().HasForeignKey(x => x.FilmeId).OnDelete(DeleteBehavior.Restrict);
        model.Entity<Sala>().HasOne<Unidade>().WithMany().HasForeignKey(x => x.UnidadeId).OnDelete(DeleteBehavior.Restrict);
        model.Entity<Sessao>().HasOne<Sala>().WithMany().HasForeignKey(x => x.SalaId).OnDelete(DeleteBehavior.Restrict);
        model.Entity<Pedido>().HasOne<Usuario>().WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(DeleteBehavior.Restrict);
        model.Entity<Pedido>().HasMany(x => x.Itens).WithOne().HasForeignKey(x => x.PedidoId).OnDelete(DeleteBehavior.Restrict);
        model.Entity<ItemPedido>().HasOne<Produto>().WithMany().HasForeignKey(x => x.ProdutoId).OnDelete(DeleteBehavior.Restrict);
        model.Entity<Ingresso>().HasOne<Sessao>().WithMany().HasForeignKey(x => x.SessaoId).OnDelete(DeleteBehavior.Restrict);
        model.Entity<Ingresso>().HasOne<Pedido>().WithMany().HasForeignKey(x => x.PedidoId).OnDelete(DeleteBehavior.Restrict);
        model.Entity<Sessao>().Property(x => x.Preco).HasPrecision(10, 2);
        model.Entity<Produto>().Property(x => x.Preco).HasPrecision(10, 2);
        model.Entity<Ingresso>().Property(x => x.Preco).HasPrecision(10, 2);
        model.Entity<ItemPedido>().Property(x => x.Preco).HasPrecision(10, 2);
        model.Entity<Pedido>().Property(x => x.Total).HasPrecision(10, 2);
    }

    public void Registrar(string funcionario, string tarefa)
    {
        Logs.Add(new Log { Funcionario = funcionario, Tarefa = tarefa });
    }
}
