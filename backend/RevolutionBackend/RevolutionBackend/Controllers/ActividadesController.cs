using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RevolutionBackend.Data;
using RevolutionBackend.Models;

namespace RevolutionBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActividadesController : ControllerBase
    {
        private readonly GymContext _context;
        public ActividadesController(GymContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Actividad>>> Get()
        {
            return await _context.Actividades.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Actividad>> GetById(int id)
        {
            var actividad = await _context.Actividades.FindAsync(id);
            if (actividad == null)
            {
                return NotFound();
            }
            return actividad;
        }

        [HttpPost]
        public async Task<ActionResult> Post(Actividad actividad)
        {
            _context.Actividades.Add(actividad);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Actividad actividad)
        {
            if (id != actividad.Id)
            {
                return BadRequest("El ID del actividad no coincide con el de la URL.");
            }
            _context.Entry(actividad).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Si ocurre un error de concurrencia, verificamos si el actividad realmente existe
                if (!actividadExists(id))
                {
                    return NotFound($"No se encontró ningún actividad con el ID {id}.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var actividad = await _context.Actividades.FindAsync(id);
            if (actividad == null)
            {
                return NotFound($"No se encontró ningún actividad con el ID {id}.");
            }

            _context.Actividades.Remove(actividad);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool actividadExists(int id)
        {
            return _context.Socios.Any(e => e.Id == id);
        }
    }
}
