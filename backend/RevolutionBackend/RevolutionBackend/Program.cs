using Microsoft.EntityFrameworkCore;
using RevolutionBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddOpenApi();

// Conexión MySQL + Entity Framework
builder.Services.AddDbContext<GymContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("ConexionMySQL")
    ));

// CORS para React
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// OpenAPI
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Middleware
app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();