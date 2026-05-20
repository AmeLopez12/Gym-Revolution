using Microsoft.EntityFrameworkCore;
using RevolutionBackend.Models;

namespace RevolutionBackend.Data
{
    public class GymContext : DbContext
    {
        public GymContext(DbContextOptions<GymContext> options)
            : base(options)
        {
        }

        public DbSet<Socio> Socios { get; set; }
    }
}
