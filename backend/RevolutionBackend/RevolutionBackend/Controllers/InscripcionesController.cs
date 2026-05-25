using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RevolutionBackend.Data;
using RevolutionBackend.Models;

namespace RevolutionBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InscripcionesController : ControllerBase
    {
        private readonly GymContext _context;

        public InscripcionesController(GymContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Inscripcion>>> Get()
        {
            return await _context.Inscripciones
                .Include(i => i.Socio)
                .Include(i => i.Actividad)
                    .ThenInclude(a => a.Instructor)
                .Include(i => i.HorarioActividad)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult> Post(Inscripcion inscripcion)
        {
            inscripcion.FechaInscripcion = DateTime.Now;

            _context.Inscripciones.Add(inscripcion);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var inscripcion = await _context.Inscripciones.FindAsync(id);

            if (inscripcion == null)
            {
                return NotFound();
            }

            _context.Inscripciones.Remove(inscripcion);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}