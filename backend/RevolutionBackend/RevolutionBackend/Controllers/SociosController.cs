using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RevolutionBackend.Data;
using RevolutionBackend.Models;

namespace RevolutionBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SociosController : ControllerBase
    {
        private readonly GymContext _context;
        public SociosController(GymContext context)
        {
            _context = context;
        }

        // GET: api/socios
        [HttpGet]
        public async Task<ActionResult<List<Socio>>> Get()
        {
            return await _context.Socios.ToListAsync();
        }

        // GET: api/socios/5 (Método auxiliar necesario para el CreatedAtAction del Post)
        [HttpGet("{id}")]
        public async Task<ActionResult<Socio>> GetById(int id)
        {
            var socio = await _context.Socios.FindAsync(id);
            if (socio == null)
            {
                return NotFound();
            }
            return socio;
        }

        // POST: api/socios
        [HttpPost]
        public async Task<ActionResult<Socio>> Post(Socio socio)
        {
            _context.Socios.Add(socio);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = socio.Id }, socio);
        }

        // PUT: api/socios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Socio socio)
        {
            if (id != socio.Id)
            {
                return BadRequest("El ID del socio no coincide con el de la URL.");
            }
            _context.Entry(socio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Si ocurre un error de concurrencia, verificamos si el socio realmente existe
                if (!SocioExists(id))
                {
                    return NotFound($"No se encontró ningún socio con el ID {id}.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/socios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var socio = await _context.Socios.FindAsync(id);
            if (socio == null)
            {
                return NotFound($"No se encontró ningún socio con el ID {id}.");
            }

            _context.Socios.Remove(socio);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool SocioExists(int id)
        {
            return _context.Socios.Any(e => e.Id == id);
        }
    }
}