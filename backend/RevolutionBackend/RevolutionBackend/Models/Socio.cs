using System.ComponentModel.DataAnnotations;

namespace RevolutionBackend.Models
{
    public class Socio
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string NombreCompleto { get; set; }

        [MaxLength(20)]
        public string Telefono { get; set; }

        public DateTime FechaRegistro { get; set; }

        public DateTime Vencimiento { get; set; }

        public bool Estado { get; set; }

        [MaxLength(50)]
        public string Descuento { get; set; }

        public List<Inscripcion>? Inscripciones { get; set; }
    }
}