import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import "./Estilos/dashboard.css";

function Dashboard() {

  const [socios, setSocios] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inscripciones, setInscripciones] = useState([]);

  const usuario = 
      JSON.parse(
      localStorage.getItem("usuario")
  );

  useEffect(() => {

    if (!usuario) {
      window.location.href = "/login";
    }

    obtenerSocios();
    obtenerActividades();
    obtenerInscripciones();
  }, []);

  const obtenerSocios = async () => {

    try {
      const res = await fetch(
        "https://localhost:7099/api/socios"
      );

      const data = await res.json();
      const ultimos3 = data
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);
      setSocios(ultimos3);
    } catch (error) {
        console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerActividades = async () => {

    try {
      const res = await fetch(
        "https://localhost:7099/api/actividades"
      );

      const data = await res.json();
      setActividades(data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerInscripciones = async () => {
    try {
      const res = await fetch(
        "https://localhost:7099/api/inscripciones"
      );

      const data = await res.json();
      setInscripciones(data);
    } catch (error) {
      console.error(error);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha)
      .toLocaleDateString("es-MX");
  };

  const hoy = new Date();

  const fechaHoy =
    hoy.getFullYear() +
    "-" +
    String(hoy.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(hoy.getDate()).padStart(2, "0");

  console.log("FECHA HOY:", fechaHoy);
  console.log("ACTIVIDADES:", actividades);

  const actividadesDelDia = actividades.flatMap((a) =>
    (a.horarios || [])
      .filter((h) =>
        h.fecha.split("T")[0] === fechaHoy
      )
      .map((h) => ({
        ...a,
        horario: h
      }))
  );

  const parseHora = (hora) => {
    if (!hora) return 0;
    const partes = hora.split(":");
    return (
      parseInt(partes[0]) * 60 +
      parseInt(partes[1])
    );
  };

  const actividadesOrdenadas =
    actividadesDelDia
      .slice()
      .sort(
        (a, b) =>
          parseHora(a.horario?.horaInicio)
          -
          parseHora(b.horario?.horaInicio)
      );

  const obtenerInscritos = (horarioId) => {
    console.log("HORARIO:", horarioId);
    console.log("INSCRIPCIONES:", inscripciones);
    return inscripciones.filter(
      (i) => i.horarioActividadId === horarioId
    ).length;
  };


  console.log(actividadesOrdenadas);
  return (

    <Container fluid className="dashboard-container py-4">

      <Row className="mb-4">
        <Col>
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Dashboard
              </h1>
              <p className="dashboard-subtitle"> Bienvenido a Revolution Fitness </p>
            </div>

            <Button
              className="btn-outline-accent-success"
              onClick={() => {
                localStorage.removeItem(
                  "usuario"
                );
                window.location.href =
                  "/login";
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </Col>

      </Row>
      <Row className="mt-5 mb-3">
        <Col>
          <div className="section-header">
            <h3 className="text-accent-green">
              Últimos socios registrados
            </h3>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {
          loading
            ? (
              <p className="text-center text-light">
                Cargando...
              </p>
            )
            : (
              socios.map((socio) => (
                <Col
                  md={4}
                  key={socio.id}
                >
                  <Card className="custom-card-dark h-100">
                    <Card.Body>
                      <h5 className="text-accent-green mb-3">
                        {socio.nombreCompleto}
                      </h5>
                      <p>
                        <strong>Estado:</strong>{" "}
                        <span className={
                          socio.estado
                            ? "text-accent-green fw-bold"
                            : "text-danger fw-bold"
                        }>
                          {
                            socio.estado                              
                              ? "Activo"
                              : "Inactivo"
                          }
                        </span>
                      </p>

                      <p>
                        <strong>Pago:</strong>{" "}
                        ${socio.descuento}
                      </p>

                      <p>
                        <strong>Vencimiento:</strong>{" "}

                        {
                          formatearFecha(
                            socio.vencimiento
                          )
                        }
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )
        }
      </Row>

      {/* CRONOGRAMA */}

      <Row className="mt-5 mb-3">
        <Col>
          <div className="section-header">
            <h3 className="text-accent-green">
              Cronograma del día
            </h3>
          </div>
        </Col>
      </Row>
      <Row>

        <Col>
          <Card className="custom-card-dark">
            <Card.Body className="p-0">
              <Table
                striped
                bordered
                hover
                responsive
                variant="dark"
                className="custom-table-dark mb-0"
              >
                <thead>
                  <tr>
                    <th>Actividad</th>
                    <th>Hora</th>
                    <th>Instructor</th>
                    <th>Cupo Disponible</th>
                  </tr>
                </thead>
                <tbody>

                  {
                    actividadesOrdenadas.length === 0
                      ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center"
                          >
                            No hay actividades hoy
                          </td>
                        </tr>
                      )
                      : (
                        actividadesOrdenadas.map((act) => (
                          <tr key={act.id}>
                            <td>
                              {act.nombre}
                            </td>
                            <td>
                              {
                                act.horario?.horaInicio?.substring(0, 5)
                              }
                            </td>
                            <td>
                              {
                                act.instructor?.nombreCompleto
                                ??
                                "Sin instructor"
                              }
                            </td>
                            <td>
                              {obtenerInscritos(act.horario.id)} / { act.cupoMaximo}
                            </td>
                          </tr>
                        ))
                      )
                  }
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;