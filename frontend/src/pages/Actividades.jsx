import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Form,
    Card,
    Modal,
} from "react-bootstrap";
import "./Estilos/socios.css"; 
import "./Estilos/actividades.css"; 

function Actividades() {
    const [vista, setVista] = useState("tabla");
    const [actividades, setActividades] = useState([]);
    const [instructores, setInstructores] = useState([]);
    const [socios, setSocios] = useState([]); 
    const [inscripciones, setInscripciones] = useState([]); 
    const [busqueda, setBusqueda] = useState("");
    const [actividadEditandoId, setActividadEditandoId] = useState(null);

    const [showInscribirModal, setShowInscribirModal] = useState(false);
    const [actividadParaInscribir, setActividadParaInscribir] = useState(null);
    const [inscripcion, setInscripcion] = useState({ SocioId: "", ActividadId: "", InstructorId: "" });

    const [showInscritosModal, setShowInscritosModal] = useState(false);
    const [actividadSeleccionadaInscritos, setActividadSeleccionadaInscritos] = useState(null);
    const [confirmarDeinscribirId, setConfirmarDeinscribirId] = useState(null); // Guarda el ID de la inscripción a borrar

    const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);

    const [mensajePantalla, setMensajePantalla] = useState({ texto: "", tipo: "" });

    const modeloActividadVacio = {
        nombre: "",
        horario: "",
        duracion: "",
        instructorId: "",
        precio: "",
        cupoMaximo: "",
    };

    const [nuevaActividad, setNuevaActividad] = useState(modeloActividadVacio);

    const cambiarMensaje = (texto, tipo = "info") => {
        setMensajePantalla({ texto, tipo });
        setTimeout(() => {
            setMensajePantalla({ texto: "", tipo: "" });
        }, 3000);
    };

    // Al cargar la pantalla, traemos los datos del Backend
    useEffect(() => {
        obtenerActividades();
        obtenerInstructores();
        obtenerSocios();
        obtenerInscripciones(); 
    }, []);

    const obtenerInstructores = async () => {
        try {
            const res = await fetch("https://localhost:7099/api/instructores");
            //const res = await fetch("https://localhost:44348/api/instructores");
            if (res.ok) {
                const data = await res.json();
                setInstructores(data);
            }
        } catch (error) {
            console.error("Error al obtener instructores:", error);
        }
    };

    const obtenerActividades = async () => {
        try {
            const res = await fetch("https://localhost:7099/api/actividades");
            //const res = await fetch("https://localhost:44348/api/actividades");
            if (res.ok) {
                const data = await res.json();
                setActividades(data);
            }
        } catch (error) {
            console.error("Error al obtener actividades:", error);
        }
    };

    const obtenerSocios = async () => {
        try {
            const res = await fetch("https://localhost:7099/api/socios");
            //const res = await fetch("https://localhost:44348/api/socios");
            if (res.ok) {
                const data = await res.json();
                setSocios(data);
            }
        } catch (error) {
            console.error("Error al obtener socios:", error);
        }
    };

    const obtenerInscripciones = async () => {
        try {
            const res = await fetch("https://localhost:7099/api/inscripciones");
            //const res = await fetch("https://localhost:44348/api/inscripciones");
            if (res.ok) {
                const data = await res.json();
                setInscripciones(data);
            }
        } catch (error) {
            console.error("Error al obtener inscripciones:", error);
        }
    };

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevaActividad({ ...nuevaActividad, [name]: value });
    };

    const guardarActividad = async (e) => {
        e.preventDefault();

        const instructorIdValue = Number(nuevaActividad.instructorId);
        const cupoMaximoValue = nuevaActividad.cupoMaximo ?? nuevaActividad.CupoMaximo;
        const precioValue = nuevaActividad.precio ?? nuevaActividad.Precio;

        if (
            !nuevaActividad.nombre ||
            !nuevaActividad.horario ||
            !nuevaActividad.duracion ||
            !precioValue ||
            !cupoMaximoValue ||
            Number.isNaN(instructorIdValue) || 
            instructorIdValue <= 0
        ) {
            cambiarMensaje("Completa todos los campos y selecciona un instructor válido.", "danger");
            return;
        }

        try {
            const url = actividadEditandoId
                ? `https://localhost:7099/api/actividades/${actividadEditandoId}`
                : "https://localhost:7099/api/actividades";
                /*? `https://localhost:44348/api/actividades/${actividadEditandoId}`
                : "https://localhost:44348/api/actividades";*/

            const metodo = actividadEditandoId ? "PUT" : "POST";

            const actividadAEnviar = {
                Nombre: nuevaActividad.nombre,
                Horario: nuevaActividad.horario.slice(0, 20), 
                Duracion: nuevaActividad.duracion.slice(0, 20),
                CupoMaximo: String(cupoMaximoValue).slice(0, 3),
                Precio: String(precioValue).slice(0, 10),
                InstructorId: instructorIdValue,
                Instructor: null, 
                Inscripciones: []
            };

            const cuerpo = actividadEditandoId ? { ...actividadAEnviar, Id: actividadEditandoId } : actividadAEnviar;

            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpo),
            });

            if (res.ok) {
                cambiarMensaje(actividadEditandoId ? "¡Actividad actualizada!" : "¡Actividad agregada!", "success");
                cancelarFormulario();
                await obtenerActividades(); 
            } else {
                const errorText = await res.text();
                cambiarMensaje(`Error: ${res.status} ${errorText}`, "danger");
            }
        } catch (error) {
            cambiarMensaje("No se pudo conectar con el servidor.", "danger");
        }
    };

    const iniciarEdicion = (actividad) => {
        const id = actividad.id ?? actividad.Id;
        const nombre = actividad.nombre ?? actividad.Nombre ?? "";
        const horarioOriginal = actividad.horario ?? actividad.Horario ?? "";
        const duracion = actividad.duracion ?? actividad.Duracion ?? "";
        const cupo = actividad.cupoMaximo ?? actividad.CupoMaximo ?? "";
        const precio = actividad.precio ?? actividad.Precio ?? "";
        const instructorId = actividad.instructorId ?? actividad.InstructorId ?? "";

        setActividadEditandoId(id);
        setNuevaActividad({ nombre, horario: horarioOriginal, duracion, instructorId, precio, cupoMaximo: cupo });
        setVista("agregar");
    };

    const eliminarActividad = async (id) => {
        try {
            const res = await fetch(`https://localhost:7099/api/actividades/${id}`, { 
            //const res = await fetch(`https://localhost:44348/api/actividades/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                cambiarMensaje("Actividad eliminada con éxito.", "success");
                obtenerActividades();
            }
        } catch (error) {
            cambiarMensaje("Error al intentar eliminar.", "danger");
        }
        setConfirmarEliminarId(null);
    };
    
    const cancelarFormulario = () => {
        setNuevaActividad(modeloActividadVacio);
        setActividadEditandoId(null);
        setVista("tabla");
    };

    const abrirInscribirModal = (actividad) => {
        const actId = actividad.id ?? actividad.Id;
        const instId = actividad.instructorId ?? actividad.InstructorId ?? "";
        
        const instructorAsignado = instructores.find(ins => Number(ins.id ?? ins.Id) === Number(instId));
        
        setActividadParaInscribir({
            ...actividad,
            nombre: actividad.nombre ?? actividad.Nombre,
            horario: actividad.horario ?? actividad.Horario,
            nombreInstructor: instructorAsignado ? (instructorAsignado.nombreCompleto ?? instructorAsignado.NombreCompleto ?? instructorAsignado.nombre) : "No asignado"
        });
        
        setInscripcion({ SocioId: "", ActividadId: actId, InstructorId: instId || "" });
        setShowInscribirModal(true);
    };

    const cerrarInscribirModal = () => {
        setShowInscribirModal(false);
        setActividadParaInscribir(null);
        setInscripcion({ SocioId: "", ActividadId: "", InstructorId: "" });
    };

    const guardarInscripcion = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        const socioId = Number(inscripcion.SocioId);
        const actividadId = Number(inscripcion.ActividadId);
        let instructorId = actividadParaInscribir ? (actividadParaInscribir.instructorId ?? actividadParaInscribir.InstructorId) : null;
        
        const fechaHoy = new Date().toISOString().split('T')[0];
        
        if (!socioId || !actividadId) {
            cambiarMensaje("Por favor, selecciona un socio válido.", "danger");
            return;
        }

        const yaInscrito = inscripciones.some(
            (i) => Number(i.socioId ?? i.SocioId) === socioId && Number(i.actividadId ?? i.ActividadId) === actividadId
        );

        if (yaInscrito) {
            cambiarMensaje("Este socio ya se encuentra inscrito en esta actividad.", "danger");
            return;
        }

        try {
            const payload = {
                SocioId: socioId,
                ActividadId: actividadId,
                InstructorId: instructorId ? Number(instructorId) : null,
                FechaInscripcion: fechaHoy,
                Socio: null,      
                Actividad: null    
            };

            const res = await fetch("https://localhost:7099/api/inscripciones", {
            //const res = await fetch("https://localhost:44348/api/inscripciones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                cambiarMensaje("¡Socio inscrito con éxito!", "success");
                cerrarInscribirModal();
                
                await obtenerActividades(); 
                await obtenerInscripciones(); 
            } else {
                cambiarMensaje(`Error del servidor al inscribir`, "danger");
            }
        } catch (error) {
            cambiarMensaje("No se pudo conectar al servidor.", "danger");
        }
    };

    const abrirInscritosModal = (actividad) => {
        setActividadSeleccionadaInscritos(actividad);
        setConfirmarDeinscribirId(null);
        setShowInscritosModal(true);
    };

    const cerrarInscritosModal = () => {
        setShowInscritosModal(false);
        setActividadSeleccionadaInscritos(null);
        setConfirmarDeinscribirId(null);
    };

    const eliminarInscripcion = async (idInscripcion) => {
    // 1. Quitamos inmediatamente el estado de confirmación para limpiar los botones "Sí/No"
    setConfirmarDeinscribirId(null);

    try {
        const res = await fetch(`https://localhost:7099/api/inscripciones/${idInscripcion}`, {
        //const res = await fetch(`https://localhost:44348/api/inscripciones/${idInscripcion}`, {
            method: "DELETE",
        });

        if (res.ok) {
            cambiarMensaje("Socio desinscrito correctamente.", "success");
            
        
            if (inscritosDeActividadActual.length <= 1) {
                setShowInscritosModal(false);
                setActividadSeleccionadaInscritos(null);
            }

            await obtenerInscripciones(); 
            await obtenerActividades();   
        } else {
            cambiarMensaje("Error al intentar quitar la inscripción en el servidor.", "danger");
        }
    } catch (error) {
        console.error("Error en la petición DELETE:", error);
        cambiarMensaje("No se pudo conectar al servidor.", "danger");
    }
};

    const actividadesFiltradas = actividades.filter((act) => {
        const nombre = (act.nombre ?? act.Nombre ?? "").toString().toLowerCase();
        const instructorAsignado = instructores.find(ins => Number(ins.id ?? ins.Id) === Number(act.instructorId ?? act.InstructorId));
        const nombreInst = (instructorAsignado?.nombreCompleto ?? instructorAsignado?.NombreCompleto ?? instructorAsignado?.nombre ?? "").toLowerCase();

        return nombre.includes(busqueda.toLowerCase()) || nombreInst.includes(busqueda.toLowerCase());
    });

    const inscritosDeActividadActual = actividadSeleccionadaInscritos
        ? inscripciones.filter(i => Number(i.actividadId ?? i.ActividadId) === Number(actividadSeleccionadaInscritos.id ?? actividadSeleccionadaInscritos.Id))
        : [];

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            {vista === 'tabla' && (
                <Container fluid className="py-4 text-light">
                    <Row className="mb-4">
                        <Col>
                            <div className="d-flex justify-content-between align-items-center p-4 rounded header-container-custom">
                                <div>
                                    <h1 className="text-accent-green fw-bold mb-1">Actividades</h1>
                                    <p className="text-muted-gray mb-0">Gestión de actividades</p>
                                    {mensajePantalla.texto && (
                                        <small className={`fw-semibold text-${mensajePantalla.tipo} d-block mt-1`}>
                                            {mensajePantalla.texto}
                                        </small>
                                    )}
                                </div>
                                <Button
                                    className="btn-accent-success"
                                    onClick={() => {
                                        setActividadEditandoId(null);
                                        setConfirmarEliminarId(null);
                                        setVista('agregar');
                                    }}
                                >
                                    <i className="fa-solid fa-dumbbell me-2"></i>+ Agregar Actividad
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <Card className="custom-card-dark">
                                <Card.Body>
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar actividad por nombre o instructor..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        className="custom-input-dark"
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card className="custom-card-dark">
                                <Card.Body className="p-0">
                                    <Table striped bordered hover responsive variant="dark" className="custom-table-dark mb-0 text-center">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Horario</th>
                                                <th>Duración</th>
                                                <th>Instructor</th>
                                                <th>Precio</th>
                                                <th>Cupo Máx</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {actividadesFiltradas.length > 0 ? (
                                                actividadesFiltradas.map((act) => {
                                                    const idReal = act.id ?? act.Id;
                                                    const inst = instructores.find(i => Number(i.id ?? i.Id) === Number(act.instructorId ?? act.InstructorId));
                                                    const nombreInstructor = inst ? (inst.nombreCompleto ?? inst.NombreCompleto ?? inst.nombre) : "Sin asignar";
                                                    const totalInscritos = inscripciones.filter(i => Number(i.actividadId ?? i.ActividadId) === Number(idReal)).length;
                                                    const cupoMax = act.cupoMaximo ?? act.CupoMaximo ?? 0;

                                                    return (
                                                        <tr key={idReal}>
                                                            <td>{act.nombre ?? act.Nombre}</td>
                                                            <td>{act.horario ?? act.Horario}</td>
                                                            <td>{act.duracion ?? act.Duracion}</td>
                                                            <td>{nombreInstructor}</td>
                                                            <td>${act.precio ?? act.Precio}</td>
                                                            <td className="fw-bold text-accent-green">
                                                                {totalInscritos} / {cupoMax}
                                                            </td>
                                                            <td>
                                                                {confirmarEliminarId === idReal ? (
                                                                    <div className="d-flex justify-content-center align-items-center gap-1">
                                                                        <Button variant="danger" size="sm" onClick={() => eliminarActividad(idReal)}>Sí</Button>
                                                                        <Button variant="secondary" size="sm" onClick={() => setConfirmarEliminarId(null)}>No</Button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="d-flex justify-content-center gap-2 align-items-center flex-wrap">
                                                                        <Button className="btn-accent-success" size="sm" onClick={() => abrirInscribirModal(act)}>
                                                                            <i className="fa-solid fa-user-plus me-1"></i> Inscribir
                                                                        </Button>
                                                                        <Button variant="info" size="sm" className="text-white fw-semibold" onClick={() => abrirInscritosModal(act)}>
                                                                            <i className="fa-solid fa-users me-1"></i> Inscritos
                                                                        </Button>
                                                                        <Button className="btn-outline-accent-success" size="sm" onClick={() => iniciarEdicion(act)}>Editar</Button>
                                                                        <Button variant="outline-danger" size="sm" onClick={() => setConfirmarEliminarId(idReal)}>Eliminar</Button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-muted">No se encontraron actividades registradas.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}

            {vista === 'agregar' && (
                <div className="contenedor-formulario d-flex justify-content-center align-items-center py-5">
                    <div className="bloque-formulario card bg-dark text-white p-4 shadow-lg border-secondary" style={{ maxWidth: '650px', width: '100%' }}>
                        <div className="encabezado-formulario d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
                            <div>
                                <h2 className="text-lima h3 mb-0">{actividadEditandoId !== null ? 'Editar Actividad' : 'Agregar Actividad'}</h2>
                            </div>
                            <button className="boton-cerrar btn btn-sm btn-outline-secondary text-white" onClick={cancelarFormulario}>&times;</button>
                        </div>

                        <form className="formulario row g-3" onSubmit={guardarActividad}>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Nombre de la Actividad:</label>
                                <input type="text" name="nombre" placeholder="Ej: Spinning, Zumba, Crossfit" maxLength={100} value={nuevaActividad.nombre} onChange={manejarCambioInput} className="form-control bg-black text-white border-secondary" required />
                            </div>
                            
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Duración:</label>
                                <input type="text" name="duracion" placeholder="Ej: 50 min" maxLength={20} value={nuevaActividad.duracion} onChange={manejarCambioInput} className="form-control bg-black text-white border-secondary" required />
                            </div>

                            <div className="grupo-entrada col-12">
                                <label className="form-label text-lima fw-bold">Horario de la Actividad:</label>
                                <input 
                                    type="text" 
                                    name="horario" 
                                    placeholder="Ej: Lunes 19:00, Mar-Jue 08:00" 
                                    maxLength={20} 
                                    value={nuevaActividad.horario} 
                                    onChange={manejarCambioInput} 
                                    className="form-control bg-black text-white border-secondary" 
                                    required 
                                />
                                <Form.Text className="text-muted">
                                    Por favor utiliza formatos breves que no superen los 20 caracteres (Ej: "Lunes 19:00").
                                </Form.Text>
                            </div>

                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Instructor:</label>
                                <select name="instructorId" value={nuevaActividad.instructorId} onChange={(e) => setNuevaActividad(prev => ({ ...prev, instructorId: e.target.value }))} className="form-select bg-black text-white border-secondary" required>
                                    <option value="">Seleccione instructor</option>
                                    {instructores.map((ins) => {
                                        const id = ins.id ?? ins.Id;
                                        const nombre = ins.nombreCompleto ?? ins.NombreCompleto ?? ins.nombre ?? ins.Nombre;
                                        return <option key={id} value={id}>{nombre}</option>;
                                    })}
                                </select>
                            </div>
                            <div className="grupo-entrada col-md-3">
                                <label className="form-label text-lima fw-bold">Precio ($):</label>
                                <input type="text" name="precio" placeholder="Ej: 350" maxLength={10} value={nuevaActividad.precio ?? nuevaActividad.Precio ?? ""} onChange={manejarCambioInput} className="form-control bg-black text-white border-secondary" required />
                            </div>
                            <div className="grupo-entrada col-md-3">
                                <label className="form-label text-lima fw-bold">Cupo Máximo:</label>
                                <input type="text" name="cupoMaximo" placeholder="Ej: 20" maxLength={3} value={nuevaActividad.cupoMaximo ?? nuevaActividad.CupoMaximo ?? ""} onChange={manejarCambioInput} className="form-control bg-black text-white border-secondary" required />
                            </div>
                            <div className="col-12 mt-4 d-flex gap-2">
                                <Button type="submit" className="btn-accent-success flex-grow-1 fw-bold py-2">{actividadEditandoId !== null ? 'Guardar Cambios' : 'Guardar Actividad'}</Button>
                                <Button type="button" variant="outline-danger" className="py-2 px-4" onClick={cancelarFormulario}>Cancelar</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de inscripción */}
            <Modal show={showInscribirModal} onHide={cerrarInscribirModal} centered>
                <Modal.Header closeButton className="bg-dark text-white border-secondary">
                    <Modal.Title className="fw-bold text-lima">Inscribir Socio a Actividad</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <Form id="formInscripcion" onSubmit={guardarInscripcion}>
                        {actividadParaInscribir && (
                            <div className="p-3 bg-black rounded mb-3 border border-secondary text-light">
                                <p className="mb-1"><strong>Actividad:</strong> {actividadParaInscribir.nombre}</p>
                                <p className="mb-1"><strong>Instructor:</strong> {actividadParaInscribir.nombreInstructor}</p>
                                <p className="mb-0"><strong>Horario:</strong> {actividadParaInscribir.horario}</p>
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label fw-bold text-lima">Socio a Inscribir:</label>
                            <select 
                                name="SocioId" 
                                value={inscripcion.SocioId} 
                                onChange={(e) => setInscripcion(prev => ({ ...prev, SocioId: e.target.value }))} 
                                className="form-select bg-black text-white border-secondary"
                                required
                            >
                                <option value="">-- Selecciona un socio --</option>
                                {socios.map((s) => {
                                    const id = s.id ?? s.Id;
                                    const nombre = s.nombreCompleto ?? s.NombreCompleto ?? s.nombre ?? s.Nombre;
                                    return <option key={id} value={id}>{nombre}</option>;
                                })}
                            </select>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="outline-secondary text-white" onClick={cerrarInscribirModal}>Cancelar</Button>
                    <Button variant="success" type="submit" form="formInscripcion">Confirmar Inscripción</Button>
                </Modal.Footer>
            </Modal>

            {/* NUEVO MODAL: Lista de Socios Inscritos y Deinscripción */}
            <Modal show={showInscritosModal} onHide={cerrarInscritosModal} centered size="md">
                <Modal.Header closeButton className="bg-dark text-white border-secondary">
                    <Modal.Title className="fw-bold text-lima">
                        Socios Inscritos — {actividadSeleccionadaInscritos ? (actividadSeleccionadaInscritos.nombre ?? actividadSeleccionadaInscritos.Nombre) : ""}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white p-0">
                    <div style={{ maxHeigth: '400px', overflowY: 'auto' }}>
                        <Table striped bordered hover variant="dark" className="custom-table-dark mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Nombre del Socio</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inscritosDeActividadActual.length > 0 ? (
                                    inscritosDeActividadActual.map((ins) => {
                                        const idInscripcion = ins.id ?? ins.Id;
                                        const socioId = ins.socioId ?? ins.SocioId;
                                        
                                        // Buscar el nombre del socio correspondiente en el estado local de socios
                                        const socioMatch = socios.find(s => Number(s.id ?? s.Id) === Number(socioId));
                                        const nombreSocio = socioMatch 
                                            ? (socioMatch.nombreCompleto ?? socioMatch.NombreCompleto ?? socioMatch.nombre) 
                                            : `Socio ID: ${socioId}`;

                                        return (
                                            <tr key={idInscripcion}>
                                                <td className="align-middle text-start ps-3">{nombreSocio}</td>
                                                <td className="align-middle">
                                                    {confirmarDeinscribirId === idInscripcion ? (
                                                        <div className="d-flex justify-content-center gap-1">
                                                            <Button variant="danger" size="sm" onClick={() => eliminarInscripcion(idInscripcion)}>Sí</Button>
                                                            <Button variant="secondary" size="sm" onClick={() => setConfirmarDeinscribirId(null)}>No</Button>
                                                        </div>
                                                    ) : (
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm" 
                                                            onClick={() => setConfirmarDeinscribirId(idInscripcion)}
                                                        >
                                                            <i className="fa-solid fa-user-minus"></i> Quitar
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-muted py-3">No hay socios inscritos en esta actividad.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={cerrarInscritosModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Actividades;