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
        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Instructor> Instructores { get; set; }

        public DbSet<Actividad> Actividades { get; set; }

        public DbSet<Inscripcion> Inscripciones { get; set; }
    }
}
