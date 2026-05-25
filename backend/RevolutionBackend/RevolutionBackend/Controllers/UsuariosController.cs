using Microsoft.AspNetCore.Mvc;
using RevolutionBackend.Data;
using RevolutionBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace RevolutionBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class UsuariosController : ControllerBase
    {
        private readonly GymContext _context;
        public UsuariosController(GymContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Usuario>>> Get()
        {
            return await _context.Usuarios.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult> Post(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(
    [FromBody] Usuario login
)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u =>

                    u.Username == login.Username &&
                    u.Password == login.Password &&
                    u.Activo
                );

            if (usuario == null)
            {
                return Unauthorized(
                    new
                    {
                        mensaje =
                            "Usuario o contraseña incorrectos"
                    }
                );
            }

            return Ok(
                new
                {
                    id = usuario.Id,
                    nombre = usuario.NombreCompleto,
                    username = usuario.Username
                }
            );
        }

    }
}