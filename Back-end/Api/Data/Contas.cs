using System.Security.Claims;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace CineJoy.Api.Data;

public static class Contas
{
    public static async Task<Usuario> Cadastrar(Banco banco, Cadastro dados, string papel)
    {
        string email = dados.Email.Trim().ToLowerInvariant();
        string login = dados.UserLogin.Trim();
        if (dados.DataNascimento < new DateTime(1900, 1, 1) || dados.DataNascimento > DateTime.Today)
        {
            throw new ArgumentException("Data de nascimento invalida.");
        }

        if (await banco.Usuarios.AnyAsync(x => x.Email == email || x.Cpf == dados.Cpf || x.UserLogin == login))
        {
            throw new ArgumentException("Email, CPF ou login ja cadastrado.");
        }

        Usuario usuario = new Usuario
        {
            Cpf = dados.Cpf,
            Nome = dados.Nome.Trim(),
            Email = email,
            UserLogin = login,
            DataNascimento = dados.DataNascimento,
            Telefone = dados.Telefone,
            EstadoNome = dados.EstadoNome,
            EstadoSigla = dados.EstadoSigla.ToUpperInvariant(),
            CidadeNome = dados.CidadeNome,
            Papel = papel
        };
        usuario.SenhaHash = new PasswordHasher<Usuario>().HashPassword(usuario, dados.Senha);
        banco.Usuarios.Add(usuario);
        await banco.SaveChangesAsync();
        return usuario;
    }

    public static object Resumo(Usuario usuario)
    {
        return new
        {
            usuario.Id,
            usuario.Nome,
            usuario.Email,
            usuario.Papel
        };
    }

    public static Task Entrar(HttpContext context, Usuario usuario)
    {
        ClaimsIdentity identidade = new ClaimsIdentity(new[] {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Nome),
            new Claim(ClaimTypes.Role, usuario.Papel)
        }, CookieAuthenticationDefaults.AuthenticationScheme);
        return context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identidade));
    }

    public static object Perfil(Usuario usuario)
    {
        return new
        {
            usuario.Id,
            usuario.Nome,
            usuario.Cpf,
            usuario.Email,
            usuario.UserLogin,
            usuario.DataNascimento,
            usuario.Telefone,
            usuario.EstadoNome,
            usuario.EstadoSigla,
            usuario.CidadeNome
        };
    }
}
