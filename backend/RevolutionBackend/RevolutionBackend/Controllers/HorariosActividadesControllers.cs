using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RevolutionBackend.Data;
using RevolutionBackend.Models;

namespace RevolutionBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HorariosActividadesController : ControllerBase
    {
        private readonly GymContext _context;

        public HorariosActividadesController(GymContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<HorarioActividad>>> Get()
        {
            return await _context.HorariosActividades
                .Include(h => h.Actividad)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HorarioActividad>> GetById(int id)
        {
            var horario = await _context.HorariosActividades
                .Include(h => h.Actividad)
                .FirstOrDefaultAsync(h => h.Id == id);

            if (horario == null)
            {
                return NotFound();
            }

            return horario;
        }

        [HttpPost]
        public async Task<ActionResult> Post(HorarioActividad horario)
        {
            if (horario.Fecha.Date < DateTime.Today)
            {
                return BadRequest(
                    "No puedes registrar fechas pasadas"
                );
            }

            _context.HorariosActividades.Add(horario);

            await _context.SaveChangesAsync();

            return Ok(horario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(
            int id,
            HorarioActividad horario
        )
        {
            if (id != horario.Id)
            {
                return BadRequest();
            }

            if (horario.Fecha.Date < DateTime.Today)
            {
                return BadRequest(
                    "No puedes usar fechas pasadas"
                );
            }

            _context.Entry(horario).State =
                EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var horario =
                await _context.HorariosActividades.FindAsync(id);

            if (horario == null)
            {
                return NotFound();
            }

            _context.HorariosActividades.Remove(horario);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}