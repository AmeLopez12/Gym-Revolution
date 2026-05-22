using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace RevolutionBackend.Models
{
    public class Inscripcion
    {
        public int Id { get; set; }

        [Required]
        public int SocioId { get; set; }

        [Required]
        public int ActividadId { get; set; }

        public int? InstructorId { get; set; }

        [ValidateNever]
        public Socio? Socio { get; set; }

        [ValidateNever]
        public Actividad? Actividad { get; set; }
    }
}