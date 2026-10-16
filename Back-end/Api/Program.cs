using CineJoy.Api.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Threading.RateLimiting;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecrets(System.Reflection.Assembly.GetExecutingAssembly(), optional: true);
builder.Configuration.AddEnvironmentVariables();
string? conexao = builder.Configuration["CONNECTION_STRING"];
if (string.IsNullOrWhiteSpace(conexao))
{
    throw new InvalidOperationException("Configure CONNECTION_STRING nos segredos locais do .NET.");
}

builder.WebHost.UseUrls($"http://localhost:{builder.Configuration["PORTA"] ?? "8080"}");
builder.Services.AddDbContext<Banco>(options => options.UseSqlServer(conexao));
builder.Services.AddControllers();
string[] origens = (builder.Configuration["FRONTEND_ORIGINS"] ??
    "http://localhost:3000;http://127.0.0.1:3000;http://localhost:3001;http://127.0.0.1:3001").Split(';');
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(origens).AllowAnyHeader().AllowAnyMethod().AllowCredentials());
});
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
{
    options.Cookie.Name = "CineJoy.Sessao";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Events.OnValidatePrincipal = async context =>
    {
        Banco banco = context.HttpContext.RequestServices.GetRequiredService<Banco>();
        string? id = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        string? papel = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        if (!int.TryParse(id, out int numero) || !await banco.Usuarios.AnyAsync(x => x.Id == numero && x.Ativo && x.Papel == papel))
        {
            context.RejectPrincipal();
        }
    };
    options.ExpireTimeSpan = TimeSpan.FromHours(4);
    options.Events.OnRedirectToLogin = context => { context.Response.StatusCode = 401; return Task.CompletedTask; };
    options.Events.OnRedirectToAccessDenied = context => { context.Response.StatusCode = 403; return Task.CompletedTask; };
});
builder.Services.AddAuthorization();
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;
    options.AddPolicy("login", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "local",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 15, Window = TimeSpan.FromMinutes(1) }));
});
WebApplication app = builder.Build();

if (args.Contains("--verificar-banco") || args.Contains("--preparar-banco") || args.Contains("--gerar-sql"))
{
    using IServiceScope scope = app.Services.CreateScope();
    Banco banco = scope.ServiceProvider.GetRequiredService<Banco>();
    await PrepararBanco.Executar(banco, builder.Configuration, args);
    return;
}

app.Use(async (context, next) =>
{
    string metodo = context.Request.Method;
    bool alteraDados = metodo != "GET" && metodo != "HEAD" && metodo != "OPTIONS";
    if (alteraDados)
    {
        string origem = context.Request.Headers.Origin.ToString();
        bool origemPermitida = true;
        if (origem != "")
        {
            if (!Uri.TryCreate(origem, UriKind.Absolute, out Uri? url))
            {
                origemPermitida = false;
            }
            else
            {
                origemPermitida = url.Authority == context.Request.Host.Value || origens.Contains(origem);
            }
        }

        bool veioDeOutroSite = context.Request.Headers["Sec-Fetch-Site"] == "cross-site";
        if (veioDeOutroSite || !origemPermitida)
        {
            context.Response.StatusCode = 403;
            return;
        }
    }
    try
    {
        await next();
    }
    catch (ArgumentException erro)
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = erro.Message
        });
    }
    catch (DbUpdateException erro)
    {
        app.Logger.LogWarning("Falha SQL ao salvar: {Tipo}", erro.InnerException?.GetType().Name);
        context.Response.StatusCode = 409;
        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = "Registro em uso, duplicado ou alterado por outra compra. Atualize os dados."
        });
    }
    catch (SqlException erro)
    {
        app.Logger.LogWarning("Falha de conexao/consulta SQL: {Numero}", erro.Number);
        context.Response.StatusCode = erro.Number == 1205 ? 409 : 503;
        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = erro.Number == 1205
            ? "Outra compra alterou os mesmos dados. Confira os assentos e tente novamente."
            : "Banco indisponível. Confira a conexão e a estrutura das tabelas."
        });
    }
    catch (InvalidOperationException erro) when (erro.InnerException is SqlException)
    {
        app.Logger.LogWarning("Falha SQL durante consulta ao banco.");
        context.Response.StatusCode = 503;
        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = "Banco indisponível. Confira a conexão e a estrutura das tabelas."
        });
    }
});
app.UseRateLimiter();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/", () => "API CineJoy Web");
app.MapGet("/api/saude", async (Banco banco) =>
{
    try
    {
        await banco.Unidades.CountAsync();
        return Results.Ok(new
        {
            banco = "SQL Server conectado",
            pagamento = "Simulacao"
        });
    }
    catch { return Results.Json(new { mensagem = "Banco indisponível ou tabelas pendentes." }, statusCode: 503); }
});
app.MapControllers();
app.Run();
