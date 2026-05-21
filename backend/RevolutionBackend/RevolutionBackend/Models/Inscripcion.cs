namespace RevolutionBackend.Models
{
    public class Inscripcion
    {
        public int Id { get; set; }

        public DateTime FechaInscripcion { get; set; }

        public int SocioId { get; set; }

        public Socio Socio { get; set; }

        public int ActividadId { get; set; }

        public Actividad Actividad { get; set; }
    }
}