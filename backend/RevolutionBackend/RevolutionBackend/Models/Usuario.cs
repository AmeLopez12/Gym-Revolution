using System.ComponentModel.DataAnnotations;

namespace RevolutionBackend.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string NombreCompleto { get; set; }
        [MaxLength(10)]
        public string Telefono { get; set; }
        [MaxLength (10)]
        public string Username { get; set; }
        [MinLength(8)]
        [MaxLength(20)]
        public string Password { get; set; }
        public bool Activo { get; set; }

    }
}
