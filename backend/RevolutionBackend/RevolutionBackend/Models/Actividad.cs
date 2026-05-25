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

        public int Duracion { get; set; }

        public int CupoMaximo { get; set; }
        public decimal Precio { get; set; }

        public int InstructorId { get; set; }

        public Instructor? Instructor { get; set; }
        public List<HorarioActividad>? Horarios { get; set; }

    }
}