using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RevolutionBackend.Data;
using RevolutionBackend.Models;

namespace RevolutionBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructoresController : ControllerBase
    {
        private readonly GymContext _context;
        public InstructoresController(GymContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Instructor>>> Get()
        {
            return await _context.Instructores.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Instructor>> GetById(int id)
        {
            var instructor = await _context.Instructores.FindAsync(id);
            if (instructor == null)
            {
                return NotFound();
            }
            return instructor;
        }

        [HttpPost]
        public async Task<ActionResult> Post(Instructor instructor)
        {
            _context.Instructores.Add(instructor);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Instructor instructor)
        {
            if (id != instructor.Id)
            {
                return BadRequest("El ID del instructor no coincide con el de la URL.");
            }
            _context.Entry(instructor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Si ocurre un error de concurrencia, verificamos si el instructor realmente existe
                if (!instructorExists(id))
                {
                    return NotFound($"No se encontró ningún instructor con el ID {id}.");
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
            var instructor = await _context.Instructores.FindAsync(id);
            if (instructor == null)
            {
                return NotFound($"No se encontró ningún instructor con el ID {id}.");
            }

            _context.Instructores.Remove(instructor);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool instructorExists(int id)
        {
            return _context.Instructores.Any(e => e.Id == id);
        }
    }
}
