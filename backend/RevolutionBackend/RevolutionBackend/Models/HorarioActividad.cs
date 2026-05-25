namespace RevolutionBackend.Models
{
    public class HorarioActividad
    {
        public int Id { get; set; }

        public int ActividadId { get; set; }

        public Actividad? Actividad { get; set; }

        public DateTime Fecha { get; set; }

        public DayOfWeek DiaSemana { get; set; }

        public TimeSpan HoraInicio { get; set; }


    }
}
