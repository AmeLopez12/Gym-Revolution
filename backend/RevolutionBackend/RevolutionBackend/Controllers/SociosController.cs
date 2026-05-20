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

        [HttpGet]
        public async Task<ActionResult<List<Socio>>> Get()
        {
            return await _context.Socios.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult> Post(Socio socio)
        {
            _context.Socios.Add(socio);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
