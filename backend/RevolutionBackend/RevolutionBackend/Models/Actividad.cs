using System.ComponentModel.DataAnnotations;

namespace RevolutionBackend.Models
{
    public class Actividad
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string Nombre { get; set; }
        [MaxLength(20)]
        public string Horario { get; set; }
        [MaxLength(20)]
        public string Duracion { get; set; }
        [MaxLength(3)]
        public string CupoMaximo { get; set; }
        [MaxLength(10)]
        public string Precio { get; set; }

        public int InstructorId { get; set; }

        public Instructor Instructor { get; set; }

        public List<Inscripcion> Inscripciones { get; set; }
    }
}