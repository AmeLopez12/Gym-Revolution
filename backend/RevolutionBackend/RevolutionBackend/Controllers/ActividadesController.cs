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

        [HttpPost]
        public async Task<ActionResult> Post(Actividad actividad)
        {
            _context.Actividades.Add(actividad);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
