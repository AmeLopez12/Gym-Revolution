import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerSocios();
  }, []);

  const obtenerSocios = async () => {
    try {
      const res = await fetch("https://localhost:7099/api/socios");
      const data = await res.json();

      const ultimos3 = data
        .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
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
            <div className="col-md-4" key={socio.id}>
              <div className="card bg-secondary text-light h-100 shadow-lg border-0">

                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">

                    <div
                      className="rounded-circle bg-dark d-flex align-items-center justify-content-center me-3"
                      style={{ width: 55, height: 55, fontWeight: "bold", color: "var(--verde-lima)"}}
                    >
                      ID
                    </div>

                    <h5 className="mb-0">{socio.nombreCompleto}</h5>
                  </div>

                  <p><strong>ID:</strong> {socio.id}</p>
                  <p><strong>Teléfono:</strong> {socio.telefono}</p>

                  <p>
                    <strong>Estado:</strong>{" "}
                    <span className={socio.estado ? "text-verde-lima" : "text-danger"} style={{ color: "var(--verde-lima)"}}>
                      {socio.estado ? "Activo" : "Inactivo"}
                    </span>
                  </p>

                  <p><strong>Descuento:</strong> {socio.descuento}</p>

                  <p>
                    <strong>Registro:</strong> {formatearFecha(socio.fechaRegistro)}
                  </p>

                  <p>
                    <strong>Vencimiento:</strong> {formatearFecha(socio.vencimiento)}
                  </p>

                  <button
                    className={`btn w-100 ${
                      socio.estado ? "btn-success" : "btn-danger" 
                    }`}
                  style={{ color: "var(--verde-lima)"}}>
                    {socio.estado ? "Sin deuda" : "Con deuda"}
                  </button>
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
    </div>
  );
}
export default Dashboard;