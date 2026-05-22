using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace RevolutionBackend.Models
{
    public class Actividad
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre de la actividad es requerido.")]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El horario es requerido.")]
        [MaxLength(100)]
        public string Horario { get; set; } = string.Empty;

        [Required(ErrorMessage = "La duración es requerida.")]
        [MaxLength(20)]
        public string Duracion { get; set; } = string.Empty;

        [Required(ErrorMessage = "El cupo máximo es requerido.")]
        [MaxLength(3)]
        public string CupoMaximo { get; set; } = string.Empty;

        [Required(ErrorMessage = "El precio es requerido.")]
        [MaxLength(10)]
        public string Precio { get; set; } = string.Empty;

        [Required]
        public int InstructorId { get; set; }

        [ValidateNever]
        public Instructor? Instructor { get; set; }

        [ValidateNever]
        public List<Inscripcion>? Inscripciones { get; set; } = new List<Inscripcion>();
    }
}