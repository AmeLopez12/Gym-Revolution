using System.ComponentModel.DataAnnotations;

namespace RevolutionBackend.Models
{
    public class Instructor
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string NombreCompleto { get; set; }
        [MaxLength(100)]
        public string Especialidad { get; set; }
        [MaxLength(50)]
        public string Telefono { get; set; }
        [MaxLength(10)]
        public string Salario { get; set; }

        public List<Actividad> Actividades { get; set; }
    }
}