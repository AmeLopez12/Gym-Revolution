import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [socios, setSocios] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerSocios();
    obtenerActividades();
  }, []);

  const obtenerSocios = async () => {
    try {
      const res = await fetch("https://localhost:7099/api/socios");
      //const res = await fetch("https://localhost:44348/api/socios");
      const data = await res.json();

      // Normalizar campos y usar Id para determinar los últimos agregados
      const normalizados = data.map((s) => ({
        ...s,
        _fechaRegistro: s.fechaRegistro ?? s.FechaRegistro ?? null,
        _id: s.id ?? s.Id ?? 0,
      }));

      // Elegimos los últimos 3 por Id (los Id más altos), que reflejan el orden de inserción
      const ultimos3 = normalizados
        .sort((a, b) => (b._id || 0) - (a._id || 0))
        .slice(0, 3);

      setSocios(ultimos3);
    } catch (error) {
      console.error("Error al obtener socios:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-MX");
  };

  const obtenerActividades = async () => {
    try {
      const res = await fetch("https://localhost:44348/api/actividades");
      if (!res.ok) return;
      const data = await res.json();
      setActividades(data);
    } catch (error) {
      console.error("Error al obtener actividades:", error);
    }
  };

  // Normalización para buscar el día en el campo `horario`.
    const limpiar = (s) => (s ?? '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const nombresDias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const diaHoy = nombresDias[new Date().getDay()];
  const diaHoyLimpio = diaHoy.toLowerCase();

  const actividadesDelDia = actividades.filter((a) => {
    const texto = (a.horario ?? a.Horario ?? '').toString();
    const limpio = limpiar(texto);
    // Reemplaza separadores por espacios y busca palabra completa o abreviatura de 3 letras
    const palabras = limpio.replace(/[.,\/\-()]/g, ' ');
    const tokens = palabras.split(/\s+/).filter(Boolean);
    const abrev = diaHoyLimpio.slice(0, 3);
    return tokens.some((t) => t === diaHoyLimpio || t.startsWith(abrev) || t.includes(diaHoyLimpio));
  });

  // Extrae minutos desde medianoche para ordenar por hora (intenta parsear hh:mm y AM/PM)
  const parseTimeFromHorario = (texto) => {
    if (!texto) return 24 * 60; // al final
    const t = (texto ?? '').toString().toLowerCase();
    // buscar hh:mm con opcional am/pm
    const m = t.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (m) {
      let hh = parseInt(m[1], 10);
      const mm = parseInt(m[2], 10);
      const ap = (m[3] || '').toLowerCase();
      if (ap === 'pm' && hh < 12) hh += 12;
      if (ap === 'am' && hh === 12) hh = 0;
      return hh * 60 + mm;
    }
    // buscar solo hora sin minutos (ej. 7 PM)
    const m2 = t.match(/(\d{1,2})\s*(am|pm)/i);
    if (m2) {
      let hh = parseInt(m2[1], 10);
      const ap = m2[2].toLowerCase();
      if (ap === 'pm' && hh < 12) hh += 12;
      if (ap === 'am' && hh === 12) hh = 0;
      return hh * 60;
    }
    return 24 * 60;
  };

  const actividadesDelDiaOrdenadas = actividadesDelDia.slice().sort((a, b) => parseTimeFromHorario(a.horario ?? a.Horario) - parseTimeFromHorario(b.horario ?? b.Horario));

  return (
    <div className="container-fluid bg-dark min-vh-100 text-light p-4">
      

      {}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black rounded mb-4 px-3">
        <span className="navbar-brand fw-bold" style={{ color: "var(--verde-lima)"}}>
          Revolution Fitness <i className="bi bi-speedometer2"></i>
        </span>

        <div className="ms-auto text-light">
          Bienvenido Recepción |{" "}
          <a href="/login" className=" text-decoration-none" style={{ color: "var(--verde-lima)"}}>
            Cerrar sesión
          </a>
        </div>
      </nav>

      {}
      <h3 className="text-center text-verde-lima mb-4" style={{ color: "var(--verde-lima)"}}>
        Últimos 3 socios registrados
      </h3>

      {}
      {loading ? (
        <p className="text-center">Cargando socios...</p>
      ) : (
        <div className="row g-4">
          {socios.map((socio) => (
            <div className="col-md-4" key={socio.id ?? socio.Id}>
              <div className="card bg-secondary text-light h-100 shadow-lg border-0">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="mb-2">{socio.nombreCompleto ?? socio.NombreCompleto}</h5>
                    <p className="mb-1"><strong>Estado:</strong> { (socio.estado ?? socio.Estado) ? "Activo" : "Inactivo" }</p>
                    <p className="mb-1"><strong>Pago:</strong> {socio.descuento ?? socio.Descuento ?? "-"}</p>
                    <p className="mb-0"><strong>Vencimiento:</strong> {socio.vencimiento ? formatearFecha(socio.vencimiento) : (socio.Vencimiento ? formatearFecha(socio.Vencimiento) : "-")}</p>
                  </div>
                  <div className="mt-3">
                    <span className={`badge ${ (socio.estado ?? socio.Estado) ? 'bg-success' : 'bg-danger' }`}>{ (socio.estado ?? socio.Estado) ? 'Activo' : 'Inactivo' }</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      <footer className="text-center text-muted mt-5">
        © 2026 Revolution Fitness - Sistema de Gestión
      </footer>
      {/* Cronograma del día - tabla estilo actividades */}
      <div className="mt-5">
        <h3 className="text-center text-verde-lima mb-3" style={{ color: "var(--verde-lima)"}}>Cronograma del día</h3>
        {actividadesDelDiaOrdenadas.length === 0 ? (
          <p className="text-center">No hay actividades para hoy.</p>
        ) : (
          <div className="table-responsive mx-auto" style={{ maxWidth: 1000 }}>
            <div className="card bg-black border-secondary p-3">
              <table className="table table-striped table-dark mb-0 text-center">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Actividad</th>
                    <th>Duración</th>
                    <th>Instructor</th>
                    <th>Cupo</th>
                  </tr>
                </thead>
                <tbody>
                  {actividadesDelDiaOrdenadas.map((act) => (
                    <tr key={act.id ?? act.Id}>
                      <td>{act.horario ?? act.Horario}</td>
                      <td>{act.nombre ?? act.Nombre}</td>
                      <td>{act.duracion ?? act.Duracion}</td>
                      <td>{act.instructor?.nombreCompleto ?? act.instructor?.NombreCompleto ?? act.instructorId ?? act.InstructorId}</td>
                      <td>{act.cupoMaximo ?? act.CupoMaximo ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;