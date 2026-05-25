import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import "./Estilos/socios.css";

function Actividades() {

    const [vista, setVista] = useState("tabla");
    const [mensajePantalla, setMensajePantalla] =
        useState({
            texto: "",
            tipo: ""
        });
    const [actividades, setActividades] = useState([]);
    const [instructores, setInstructores] = useState([]);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [cupoMaximo, setCupoMaximo] = useState("");
    const [instructorId, setInstructorId] = useState("");
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [actividadEditandoId, setActividadEditandoId] =
        useState(null);
    const [confirmarEliminarId, setConfirmarEliminarId] =
        useState(null);

    const obtenerActividades = async () => {

        const response = await fetch(
            "https://localhost:7099/api/actividades"
        );
        const data = await response.json();
        setActividades(data);
    };

    const cambiarMensaje = (texto, tipo = "info") => {

        setMensajePantalla({
            texto,
            tipo
        });
        setTimeout(() => {
            setMensajePantalla({
                texto: "",
                tipo: ""
            });
        }, 3000);
    };

    const obtenerInstructores = async () => {

        const response = await fetch(
            "https://localhost:7099/api/instructores"
        );
        const data = await response.json();
        setInstructores(data);
    };

    const prepararEdicion = (actividad, horario) => {

        setActividadEditandoId(actividad.id);
        setNombre(actividad.nombre);
        setPrecio(actividad.precio);
        setCupoMaximo(actividad.cupoMaximo);
        setInstructorId(actividad.instructorId);
        setFecha(
            horario.fecha.split("T")[0]
        );
        setHoraInicio(
            horario.horaInicio.substring(0, 5)
        );
        setVista("agregar");
    };

    const limpiarFormulario = () => {

        setNombre("");
        setPrecio("");
        setCupoMaximo("");
        setInstructorId("");
        setFecha("");
        setHoraInicio("");
        setActividadEditandoId(null);
        setVista("tabla");
    };

    const guardarActividad = async () => {

        if (
            !nombre ||
            !precio ||
            !cupoMaximo ||
            !instructorId ||
            !fecha ||
            !horaInicio
        ) {
            cambiarMensaje(
                actividadEditandoId
                    ? "Actividad actualizada"
                    : "Actividad creada",
                "success"
            );
        }

        const fechaHoraSeleccionada =
            new Date(`${fecha}T${horaInicio}`);
        if (fechaHoraSeleccionada < new Date()) {
            cambiarMensaje(
                "No puedes registrar actividades pasadas",
                "danger"
            );
            return;
        }

        const body = {

            nombre,
            precio: parseFloat(precio),

            cupoMaximo: parseInt(cupoMaximo),

            instructorId: parseInt(instructorId),

            duracion: 60,

            horarios: [
                {
                    fecha,
                    horaInicio,
                    diaSemana:
                        new Date(fecha).getDay()
                }
            ]
        };

        try {

            const response = await fetch(

                actividadEditandoId
                    ? `https://localhost:7099/api/actividades/${actividadEditandoId}`
                    : "https://localhost:7099/api/actividades",

                {
                    method:
                        actividadEditandoId
                            ? "PUT"
                            : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(

                        actividadEditandoId
                            ? {
                                ...body,
                                id: actividadEditandoId
                            }
                            : body
                    )
                }
            );

            if (response.ok) {

                obtenerActividades();

                limpiarFormulario();

                cambiarMensaje(
                    actividadEditandoId
                        ? "Actividad actualizada"
                        : "Actividad creada",
                    "success"
                );
            }

        } catch (error) {

            console.error(error);
        }
    };

    const eliminarActividad = async (id) => {

        try {

            const response = await fetch(
                `https://localhost:7099/api/actividades/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (response.ok) {

                obtenerActividades();

                setConfirmarEliminarId(null);

                cambiarMensaje("Actividad eliminada", "success");
            }

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        obtenerActividades();

        obtenerInstructores();

    }, []);

    return (
        <div style={{ minHeight: "100vh", position: "relative" }}>
            {vista === "tabla" && (

                <Container fluid className="py-4 text-light">

                    <Row className="mb-4">

                        <Col>

                            <div className="d-flex justify-content-between align-items-center p-4 rounded header-container-custom">

                                <div>

                                    <h1 className="text-accent-green fw-bold mb-1">
                                        Actividades
                                    </h1>

                                    <p className="text-muted-gray mb-0">
                                        Gestión de actividades
                                    </p>

                                    {
                                        mensajePantalla.texto && (

                                            <small
                                                className={`fw-semibold text-${mensajePantalla.tipo} d-block mt-1`}
                                            >
                                                {mensajePantalla.texto}
                                            </small>

                                        )
                                    }

                                </div>

                                <Button
                                    className="btn-accent-success"
                                    onClick={() => {

                                        limpiarFormulario();

                                        setConfirmarEliminarId(null);

                                        setMensajePantalla({
                                            texto: "",
                                            tipo: ""
                                        });

                                        setVista("agregar");
                                    }}
                                >
                                    <i className="fa-solid fa-plus me-2"></i>

                                    + Agregar Actividad
                                </Button>

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
                                                <th>Precio</th>
                                                <th>Cupo</th>
                                                <th>Fecha</th>
                                                <th>Hora</th>
                                                <th>Instructor</th>
                                                <th>Acciones</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                actividades.map((a) => (

                                                    a.horarios?.map((h) => (

                                                        <tr key={h.id}>

                                                            <td>
                                                                {a.nombre}
                                                            </td>

                                                            <td>
                                                                ${a.precio}
                                                            </td>

                                                            <td>
                                                                {a.cupoMaximo}
                                                            </td>

                                                            <td>
                                                                {
                                                                    new Date(h.fecha)
                                                                        .toLocaleDateString("es-MX")
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    h.horaInicio?.substring(0, 5)
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    a.instructor?.nombreCompleto
                                                                }
                                                            </td>

                                                            <td>

                                                                {
                                                                    confirmarEliminarId === a.id
                                                                        ? (

                                                                            <div className="d-flex gap-2">

                                                                                <Button
                                                                                    variant="danger"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        eliminarActividad(a.id)
                                                                                    }
                                                                                >
                                                                                    Sí
                                                                                </Button>

                                                                                <Button
                                                                                    variant="secondary"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        setConfirmarEliminarId(null)
                                                                                    }
                                                                                >
                                                                                    No
                                                                                </Button>

                                                                            </div>

                                                                        )
                                                                        : (

                                                                            <>

                                                                                <Button
                                                                                    className="btn-outline-accent-success me-2"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        prepararEdicion(a, h)
                                                                                    }
                                                                                >
                                                                                    Editar
                                                                                </Button>

                                                                                <Button
                                                                                    variant="outline-danger"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        setConfirmarEliminarId(a.id)
                                                                                    }
                                                                                >
                                                                                    Eliminar
                                                                                </Button>

                                                                            </>

                                                                        )
                                                                }

                                                            </td>

                                                        </tr>

                                                    ))

                                                ))
                                            }

                                        </tbody>

                                    </Table>

                                </Card.Body>

                            </Card>

                        </Col>

                    </Row>

                </Container>

            )}

            {vista === "agregar" && (

                <div className="contenedor-formulario d-flex justify-content-center align-items-center py-5">

                    <div
                        className="bloque-formulario card bg-dark text-white p-4 shadow-lg border-secondary"
                        style={{
                            maxWidth: "700px",
                            width: "100%"
                        }}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">

                            <div>

                                <h2 className="text-accent-green h3 mb-0">

                                    {
                                        actividadEditandoId
                                            ? "Editar Actividad"
                                            : "Agregar Actividad"
                                    }

                                </h2>

                                {
                                    mensajePantalla.texto && (

                                        <small
                                            className={`fw-semibold text-${mensajePantalla.tipo} d-block mt-1`}
                                        >
                                            {mensajePantalla.texto}
                                        </small>

                                    )
                                }

                            </div>

                            <button
                                className="btn btn-sm btn-outline-secondary text-white"
                                onClick={limpiarFormulario}
                            >
                                &times;
                            </button>

                        </div>

                        <Form className="row g-3">

                            <div className="col-md-6">

                                <label className="form-label text-accent-green fw-bold">
                                    Nombre
                                </label>

                                <Form.Control
                                    placeholder="Ej: Crossfit"
                                    value={nombre}
                                    onChange={(e) =>
                                        setNombre(e.target.value)
                                    }
                                    className="custom-input-dark"
                                />

                            </div>

                            <div className="col-md-3">

                                <label className="form-label text-accent-green fw-bold">
                                    Precio
                                </label>

                                <Form.Control
                                    type="number"
                                    placeholder="500"
                                    value={precio}
                                    onChange={(e) =>
                                        setPrecio(e.target.value)
                                    }
                                    className="custom-input-dark"
                                />

                            </div>

                            <div className="col-md-3">

                                <label className="form-label text-accent-green fw-bold">
                                    Cupo Máximo
                                </label>

                                <Form.Control
                                    type="number"
                                    placeholder="10"
                                    value={cupoMaximo}
                                    onChange={(e) =>
                                        setCupoMaximo(e.target.value)
                                    }
                                    className="custom-input-dark"
                                />

                            </div>

                            <div className="col-md-12">

                                <label className="form-label text-accent-green fw-bold">
                                    Instructor
                                </label>

                                <Form.Select
                                    value={instructorId}
                                    onChange={(e) =>
                                        setInstructorId(e.target.value)
                                    }
                                    className="custom-input-dark"
                                >

                                    <option value="">
                                        Selecciona instructor
                                    </option>

                                    {
                                        instructores.map((i) => (

                                            <option
                                                key={i.id}
                                                value={i.id}
                                            >
                                                {i.nombreCompleto}
                                            </option>

                                        ))
                                    }

                                </Form.Select>

                            </div>

                            <div className="col-md-6">

                                <label className="form-label text-accent-green fw-bold">
                                    Fecha
                                </label>

                                <Form.Control
                                    type="date"
                                    value={fecha}
                                    onChange={(e) =>
                                        setFecha(e.target.value)
                                    }
                                    className="custom-input-dark"
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label text-accent-green fw-bold">
                                    Hora Inicio
                                </label>

                                <Form.Control
                                    type="time"
                                    value={horaInicio}
                                    onChange={(e) =>
                                        setHoraInicio(e.target.value)
                                    }
                                    className="custom-input-dark"
                                />

                            </div>

                            <div className="col-12 mt-4 d-flex gap-2">

                                <Button
                                    type="button"
                                    className="btn-accent-success flex-grow-1 fw-bold py-2"
                                    onClick={guardarActividad}
                                >

                                    {
                                        actividadEditandoId
                                            ? "Guardar Cambios"
                                            : "Guardar Actividad"
                                    }

                                </Button>

                                <Button
                                    type="button"
                                    variant="outline-danger"
                                    className="py-2 px-4"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </Button>

                            </div>

                        </Form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Actividades;