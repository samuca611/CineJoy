var builder = WebApplication.CreateBuilder(args);

var porta = builder.Configuration["PORTA"] ?? "8080";
builder.WebHost.UseUrls($"http://localhost:{porta}");
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("PermitirTudo");
app.MapGet("/", () => "API CineJoy Web - dados em memoria");
app.MapControllers();

app.Run();

