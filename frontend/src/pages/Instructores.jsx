import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Form,
    Card
} from "react-bootstrap";
import "./Estilos/socios.css"; // Reutiliza tus estilos existentes

function Instructores() {
    const [vista, setVista] = useState('tabla'); 
    const [instructores, setInstructores] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [instructorEditandoId, setInstructorEditandoId] = useState(null);
    
    // Estado para confirmaciones de borrado por fila
    const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);
    
    // Mensaje inline permanente o de estado para la pantalla
    const [mensajePantalla, setMensajePantalla] = useState({ texto: "", tipo: "" });

    const modeloInstructorVacio = {
        nombreCompleto: "",
        especialidad: "",
        telefono: "",
        salario: ""
    };

    const [nuevoInstructor, setNuevoInstructor] = useState(modeloInstructorVacio);

    const cambiarMensaje = (texto, tipo = "info") => {
        setMensajePantalla({ texto, tipo });
        setTimeout(() => {
            setMensajePantalla({ texto: "", tipo: "" });
        }, 3000); 
    };

    const obtenerInstructores = async () => {
        try {
            const response = await fetch("https://localhost:7099/api/instructores");
            if (!response.ok) throw new Error("Error al obtener datos");
            const data = await response.json();
            setInstructores(data);
        } catch (error) {
            console.error(error);
            cambiarMensaje("Error al conectar con el servidor para leer instructores.", "danger");
        }
    };

    const prepararEdicion = (instructor) => {
        const idIns = instructor.id !== undefined ? instructor.id : instructor.Id;
        const nombre = instructor.nombreCompleto !== undefined ? instructor.nombreCompleto : instructor.NombreCompleto;
        const esp = instructor.especialidad !== undefined ? instructor.especialidad : instructor.Especialidad;
        const tel = instructor.telefono !== undefined ? instructor.telefono : instructor.Telefono;
        const sal = instructor.salario !== undefined ? instructor.salario : instructor.Salario;

        setInstructorEditandoId(idIns);
        setNuevoInstructor({
            nombreCompleto: nombre || "",
            especialidad: esp || "",
            telefono: tel || "",
            salario: sal !== undefined && sal !== null ? String(sal) : ""
        });
        setConfirmarEliminarId(null);
        setMensajePantalla({ texto: "", tipo: "" });
        setVista('agregar'); 
    };

    const guardarInstructor = async (e) => {
        e.preventDefault();
        const esEdicion = instructorEditandoId !== null;
        
        const url = esEdicion 
            ? `https://localhost:7099/api/instructores/${instructorEditandoId}` 
            : "https://localhost:7099/api/instructores";
        
        const metodo = esEdicion ? "PUT" : "POST";

        const instructorAEnviar = {
            NombreCompleto: nuevoInstructor.nombreCompleto,
            Especialidad: nuevoInstructor.especialidad,
            Telefono: nuevoInstructor.telefono,
            Salario: String(nuevoInstructor.salario)
        };
        
        const cuerpoPeticion = esEdicion 
            ? { ...instructorAEnviar, Id: instructorEditandoId } 
            : instructorAEnviar;

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpoPeticion)
            });

            if (response.ok) {
                await obtenerInstructores();
                cambiarMensaje(
                    esEdicion ? "Instructor actualizado exitosamente" : "Instructor creado exitosamente", 
                    "success"
                );
                cancelarFormulario();
            } else {
                const errorData = await response.text();
                console.error("Error de la API:", errorData);
                cambiarMensaje("Error en la estructura de datos enviada. Revisa los campos.", "danger");
            }
        } catch (error) {
            console.error(error);
            cambiarMensaje("Error de red: No se pudo actualizar el registro.", "danger");
        }
    };

    const eliminarInstructor = async (id) => {
        try {
            const response = await fetch(`https://localhost:7099/api/instructores/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                await obtenerInstructores();
                setConfirmarEliminarId(null);
                cambiarMensaje("Registro de instructor eliminado del sistema", "warning");
            } else {
                cambiarMensaje("El servidor denegó la eliminación del instructor.", "danger");
            }
        } catch (error) {
            console.error(error);
            cambiarMensaje("Error de conexión al intentar eliminar.", "danger");
        }
    };

    const cancelarFormulario = () => {
        setNuevoInstructor(modeloInstructorVacio);
        setInstructorEditandoId(null);
        setVista('tabla');
    };

    useEffect(() => {
        obtenerInstructores();
    }, []);

    const instructoresFiltrados = instructores.filter((instructor) => {
        const nombre = instructor.nombreCompleto !== undefined ? instructor.nombreCompleto : instructor.NombreCompleto;
        return (nombre || "").toLowerCase().includes(busqueda.toLowerCase());
    });

    return (
        <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', position: 'relative' }}>
            
            {vista === 'tabla' && (
                <Container fluid className="py-4 text-light">
                    <Row className="mb-4">
                        <Col>
                            <div className="d-flex justify-content-between align-items-center p-4 rounded header-container-custom">
                                <div>
                                    <h1 className="text-accent-green fw-bold mb-1">Instructores</h1>
                                    <p className="text-muted-gray mb-0">Gestión de instructores</p>
                                    {mensajePantalla.texto && (
                                        <small className={`fw-semibold text-${mensajePantalla.tipo} d-block mt-1`}>
                                            {mensajePantalla.texto}
                                        </small>
                                    )}
                                </div>
                                <Button 
                                    className="btn-accent-success"
                                    onClick={() => { 
                                        setInstructorEditandoId(null); 
                                        setConfirmarEliminarId(null);
                                        setMensajePantalla({ texto: "", tipo: "" });
                                        setVista('agregar'); 
                                    }}
                                >
                                    <i className="fa-solid fa-user-plus me-2"></i>+ Agregar Instructor
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    {/* Buscador */}
                    <Row className="mb-4">
                        <Col>
                            <Card className="custom-card-dark">
                                <Card.Body>
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar instructor..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        className="custom-input-dark"
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Tabla de Instructores */}
                    <Row>
                        <Col>
                            <Card className="custom-card-dark">
                                <Card.Body className="p-0">
                                    <Table striped bordered hover responsive variant="dark" className="custom-table-dark mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Especialidad</th>
                                                <th>Teléfono</th>
                                                <th>Salario</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {instructoresFiltrados.map((instructor) => {
                                                const idIns = instructor.id !== undefined ? instructor.id : instructor.Id;
                                                const nombre = instructor.nombreCompleto !== undefined ? instructor.nombreCompleto : instructor.NombreCompleto;
                                                const esp = instructor.especialidad !== undefined ? instructor.especialidad : instructor.Especialidad;
                                                const tel = instructor.telefono !== undefined ? instructor.telefono : instructor.Telefono;
                                                const sal = instructor.salario !== undefined ? instructor.salario : instructor.Salario;

                                                return (
                                                    <tr key={idIns}>
                                                        <td>{idIns}</td>
                                                        <td>{nombre}</td>
                                                        <td>{esp}</td>
                                                        <td>{tel}</td>
                                                        <td>${sal}</td>
                                                        <td>
                                                            {confirmarEliminarId === idIns ? (
                                                                // Interfaz Inline de confirmación de borrado
                                                                <div className="d-flex justify-content-center align-items-center gap-1">
                                                                    <Button 
                                                                        variant="danger" 
                                                                        size="sm"
                                                                        onClick={() => eliminarInstructor(idIns)}
                                                                    >
                                                                        Sí, eliminar
                                                                    </Button>
                                                                    <Button 
                                                                        variant="secondary" 
                                                                        size="sm"
                                                                        onClick={() => setConfirmarEliminarId(null)}
                                                                    >
                                                                        No
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <Button 
                                                                        className="btn-outline-accent-success me-2" 
                                                                        size="sm"
                                                                        onClick={() => prepararEdicion(instructor)}
                                                                    >
                                                                        Editar
                                                                    </Button>
                                                                    <Button 
                                                                        variant="outline-danger" 
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setConfirmarEliminarId(idIns);
                                                                            setMensajePantalla({ texto: "", tipo: "" });
                                                                        }}
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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
                                <h2 className="text-lima h3 mb-0">
                                    {instructorEditandoId !== null ? 'Editar Instructor' : 'Agregar Instructor'}
                                </h2>
                                {mensajePantalla.texto && (
                                    <small className={`fw-semibold text-${mensajePantalla.tipo} d-block mt-1`}>
                                        {mensajePantalla.texto}
                                    </small>
                                )}
                            </div>
                            <button className="boton-cerrar btn btn-sm btn-outline-secondary text-white" onClick={cancelarFormulario}>&times;</button>
                        </div>
                        
                        <form className="formulario row g-3" onSubmit={guardarInstructor}>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Nombre Completo:</label>
                                <input
                                    type="text"
                                    name="nombreCompleto"
                                    placeholder="Ej: Laura Gómez"
                                    value={nuevoInstructor.nombreCompleto}
                                    onChange={(e) => setNuevoInstructor({ ...nuevoInstructor, nombreCompleto: e.target.value })}
                                    className="form-control bg-black text-white border-secondary"
                                    required
                                />
                            </div>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Teléfono:</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    placeholder="Ej: 4641234567"
                                    value={nuevoInstructor.telefono}
                                    onChange={(e) => setNuevoInstructor({ ...nuevoInstructor, telefono: e.target.value })}
                                    className="form-control bg-black text-white border-secondary"
                                    required
                                />
                            </div>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Especialidad:</label>
                                <input
                                    type="text"
                                    name="especialidad"
                                    placeholder="Ej: Yoga, Crossfit, Zumba"
                                    value={nuevoInstructor.especialidad}
                                    onChange={(e) => setNuevoInstructor({ ...nuevoInstructor, especialidad: e.target.value })}
                                    className="form-control bg-black text-white border-secondary"
                                    required
                                />
                            </div>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Salario ($):</label>
                                <input
                                    type="text" 
                                    name="salario"
                                    placeholder="Ej: 15000"
                                    value={nuevoInstructor.salario}
                                    onChange={(e) => setNuevoInstructor({ ...nuevoInstructor, salario: e.target.value })}
                                    className="form-control bg-black text-white border-secondary"
                                    required
                                />
                            </div>
                            <div className="col-12 mt-4 d-flex gap-2">
                                <Button type="submit" className="btn-accent-success flex-grow-1 fw-bold py-2">
                                    {instructorEditandoId !== null ? 'Guardar Cambios' : 'Guardar Instructor'}
                                </Button>
                                <Button type="button" variant="outline-danger" className="py-2 px-4" onClick={cancelarFormulario}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Instructores;