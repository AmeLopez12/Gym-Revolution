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

        [HttpPost]
        public async Task<ActionResult> Post(Instructor instructor)
        {
            _context.Instructores.Add(instructor);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
