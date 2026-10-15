using CineJoy.Api.Data;
using CineJoy.Api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace CineJoy.Api.Controllers;

[ApiController, Route("api/autenticacao")]
public class AutenticacaoController : ControllerBase
{
    private readonly Banco banco;

    public AutenticacaoController(Banco banco)
    {
        this.banco = banco;
    }

    [HttpPost("entrar"), EnableRateLimiting("login")]
    public async Task<IActionResult> Entrar(Login dados)
    {
        string email = dados.Email.Trim().ToLowerInvariant();
        Usuario? usuario = await banco.Usuarios.FirstOrDefaultAsync(x => x.Ativo && (x.Email == email || x.UserLogin == email));
        if (usuario == null || new PasswordHasher<Usuario>().VerifyHashedPassword(usuario, usuario.SenhaHash, dados.Senha) == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new
            {
                mensagem = "Email ou senha incorretos."
            });
        }

        await Contas.Entrar(HttpContext, usuario);
        return Ok(Contas.Resumo(usuario));
    }

    [HttpGet("sessao"), Authorize]
    public async Task<IActionResult> Sessao()
    {
        int id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        Usuario? usuario = await banco.Usuarios.FindAsync(id);
        return usuario == null ? Unauthorized() : Ok(Contas.Resumo(usuario));
    }

    [HttpPost("sair")]
    public async Task<IActionResult> Sair()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }
}
