import { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Table
} from "react-bootstrap";

import "./Estilos/socios.css";

function Inscripciones() {

    const [vista, setVista] = useState("tabla");

    const [mensajePantalla, setMensajePantalla] =
        useState({
            texto: "",
            tipo: ""
        });

    const [socios, setSocios] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [inscripciones, setInscripciones] = useState([]);

    const [socioId, setSocioId] = useState("");

    const [horarioSeleccionado,
        setHorarioSeleccionado] = useState("");

    const [inscripcionEditandoId,
        setInscripcionEditandoId] = useState(null);

    const [confirmarEliminarId,
        setConfirmarEliminarId] = useState(null);

    const cambiarMensaje = (
        texto,
        tipo = "info"
    ) => {

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


    const horariosDisponibles =
        actividades.flatMap((a) =>

            (a.horarios || [])

                .filter((h) => {

                    const fechaHoraActividad =
                        new Date(
                            `${h.fecha.split("T")[0]}T${h.horaInicio}`
                        );

                    return (
                        fechaHoraActividad > new Date()
                        ||
                        h.id === JSON.parse(
                            horarioSeleccionado || "{}"
                        ).horarioId
                    );

                })

                .map((h) => ({

                    actividadId: a.id,

                    horarioId: h.id,

                    texto:
                        `${a.nombre}: ` +
                        `${new Date(h.fecha)
                            .toLocaleDateString("es-MX")} - ` +
                        `${h.horaInicio.substring(0, 5)}`

                }))
        );


    const obtenerSocios = async () => {

        try {

            const response = await fetch(
                "https://localhost:7099/api/socios"
            );

            const data = await response.json();

            setSocios(data);

        } catch (error) {

            console.error(error);
        }
    };

    const obtenerActividades = async () => {

        try {

            const response = await fetch(
                "https://localhost:7099/api/actividades"
            );

            const data = await response.json();

            setActividades(data);

        } catch (error) {

            console.error(error);
        }
    };

    const obtenerInscripciones = async () => {

        try {

            const response = await fetch(
                "https://localhost:7099/api/inscripciones"
            );

            const data = await response.json();

            setInscripciones(data);

        } catch (error) {

            console.error(error);
        }
    };


    const prepararEdicion = (inscripcion) => {

        setInscripcionEditandoId(
            inscripcion.id
        );

        setSocioId(
            inscripcion.socioId
        );

        setHorarioSeleccionado(
            JSON.stringify({
                actividadId:
                    inscripcion.actividadId,

                horarioId:
                    inscripcion.horarioActividadId
            })
        );

        setVista("agregar");
    };

    const limpiarFormulario = () => {

        setSocioId("");

        setHorarioSeleccionado("");

        setInscripcionEditandoId(null);

        setVista("tabla");
    };


    const guardarInscripcion = async () => {

        if (!socioId || !horarioSeleccionado) {

            cambiarMensaje(
                "Completa todos los campos",
                "danger"
            );

            return;
        }

        const datos = horarioSeleccionado
            ? JSON.parse(horarioSeleccionado)
            : null;

        const yaInscrito =
            inscripciones.some((i) =>

                i.socioId ===
                parseInt(socioId) &&

                i.horarioActividadId ===
                datos.horarioId &&

                i.id !==
                inscripcionEditandoId
            );

        if (yaInscrito) {

            cambiarMensaje(
                "Este socio ya está inscrito",
                "danger"
            );

            return;
        }

        const actividadSeleccionada =
            actividades.find(
                (a) => a.id === datos.actividadId
            );

        const inscritosActuales =
            inscripciones.filter(
                (i) =>
                    i.horarioActividadId ===
                    datos.horarioId
            ).length;

        if (
            inscritosActuales >=
            actividadSeleccionada.cupoMaximo
        ) {

            cambiarMensaje(
                "Esta actividad ya alcanzó el cupo máximo",
                "danger"
            );

            return;
        }

        try {

            const response = await fetch(

                inscripcionEditandoId
                    ? `https://localhost:7099/api/inscripciones/${inscripcionEditandoId}`
                    : "https://localhost:7099/api/inscripciones",

                {
                    method:
                        inscripcionEditandoId
                            ? "PUT"
                            : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        socioId:
                            parseInt(socioId),

                        actividadId:
                            parseInt(datos.actividadId),

                        horarioActividadId:
                            parseInt(datos.horarioId)
                    })
                }
            );

            if (response.ok) {

                await obtenerInscripciones();

                limpiarFormulario();

                cambiarMensaje(

                    inscripcionEditandoId
                        ? "Inscripción actualizada"
                        : "Inscripción realizada",

                    "success"
                );

            } else {

                cambiarMensaje(
                    "Error al guardar inscripción",
                    "danger"
                );
            }

        } catch (error) {

            console.error(error);

            cambiarMensaje(
                "Error de conexión",
                "danger"
            );
        }
    };

    const eliminarInscripcion = async (id) => {

        try {

            const response = await fetch(
                `https://localhost:7099/api/inscripciones/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (response.ok) {

                obtenerInscripciones();

                setConfirmarEliminarId(null);

                cambiarMensaje(
                    "Inscripción eliminada",
                    "success"
                );
            }

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        obtenerSocios();

        obtenerActividades();

        obtenerInscripciones();

    }, []);

    return (

        <div style={{ minHeight: "100vh" }}>

            {vista === "tabla" && (

                <Container fluid className="py-4 text-light">


                    <Row className="mb-4">

                        <Col>

                            <div className="d-flex justify-content-between align-items-center p-4 rounded header-container-custom">

                                <div>

                                    <h1 className="text-accent-green fw-bold mb-1">
                                        Inscripciones
                                    </h1>

                                    <p className="text-muted-gray mb-0">
                                        Gestión de inscripciones
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

                                        setVista("agregar");
                                    }}
                                >

                                    <i className="fa-solid fa-plus me-2"></i>

                                    Nueva inscripción

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

                                                <th>ID</th>
                                                <th>Socio</th>
                                                <th>Actividad</th>
                                                <th>Fecha</th>
                                                <th>Acciones</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                inscripciones.map((i) => (

                                                    <tr key={i.id}>

                                                        <td>{i.id}</td>

                                                        <td>
                                                            {
                                                                i.socio?.nombreCompleto
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                i.actividad?.nombre
                                                            }
                                                        </td>

                                                        <td>

                                                            {
                                                                new Date(
                                                                    i.fechaInscripcion
                                                                )
                                                                    .toLocaleDateString("es-MX")
                                                            }

                                                        </td>

                                                        <td>

                                                            {
                                                                confirmarEliminarId === i.id ? (

                                                                    <div className="d-flex gap-2">

                                                                        <Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                eliminarInscripcion(i.id)
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

                                                                ) : (

                                                                    <>

                                                                        <Button
                                                                            className="btn-outline-accent-success me-2"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                prepararEdicion(i)
                                                                            }
                                                                        >
                                                                            Editar
                                                                        </Button>

                                                                        <Button
                                                                            variant="outline-danger"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                setConfirmarEliminarId(i.id)
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
                                        inscripcionEditandoId
                                            ? "Editar inscripción"
                                            : "Nueva inscripción"
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

                                <label className="form-label text-accent-green fw-semibold">
                                    Socio
                                </label>

                                <Form.Select
                                    value={socioId}
                                    onChange={(e) =>
                                        setSocioId(e.target.value)
                                    }
                                    className="custom-input-dark"
                                >

                                    <option value="">
                                        Selecciona un socio
                                    </option>

                                    {
                                        socios.map((s) => (

                                            <option
                                                key={s.id}
                                                value={s.id}
                                            >
                                                {s.nombreCompleto}
                                            </option>

                                        ))
                                    }

                                </Form.Select>

                            </div>

                            <div className="col-md-6">

                                <label className="form-label text-accent-green fw-semibold">
                                    Actividad
                                </label>

                                <Form.Select
                                    value={horarioSeleccionado}
                                    onChange={(e) =>
                                        setHorarioSeleccionado(
                                            e.target.value
                                        )
                                    }
                                    className="custom-input-dark"
                                >

                                    <option value="">
                                        Selecciona una actividad
                                    </option>

                                    {
                                        horariosDisponibles.map((h) => (

                                            <option
                                                key={h.horarioId}
                                                value={
                                                    JSON.stringify({
                                                        actividadId:
                                                            h.actividadId,

                                                        horarioId:
                                                            h.horarioId
                                                    })
                                                }
                                            >
                                                {h.texto}
                                            </option>

                                        ))
                                    }

                                </Form.Select>

                            </div>

                            <div className="col-12 mt-4 d-flex gap-2">

                                <Button
                                    type="button"
                                    className="btn-accent-success flex-grow-1 fw-bold py-2"
                                    onClick={guardarInscripcion}
                                >

                                    {
                                        inscripcionEditandoId
                                            ? "Guardar cambios"
                                            : "Guardar inscripción"
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

export default Inscripciones;