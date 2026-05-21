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
            return await _context.Inscripciones.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult> Post(Inscripcion inscripcion)
        {
            _context.Inscripciones.Add(inscripcion);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
