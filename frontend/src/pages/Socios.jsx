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
import "./Estilos/socios.css";
import * as XLSX from 'xlsx';

function Socios() {
    const [vista, setVista] = useState('tabla'); 
    const [socios, setSocios] = useState([]);
    //para busqueda y filtros
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos"); 
    const [filtroVencimiento, setFiltroVencimiento] = useState("todos");
    const [socioEditandoId, setSocioEditandoId] = useState(null);
    
    // Estado para confirmaciones de borrado por fila (guarda el ID del socio a eliminar)
    const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);
    
    // Mensaje inline permanente o de estado para la pantalla
    const [mensajePantalla, setMensajePantalla] = useState({ texto: "", tipo: "" });
    const fechaHoy = new Date().toISOString().split('T')[0];

    const modeloSocioVacio = {
        nombreCompleto: "",
        telefono: "",
        descuento: "",
        fechaRegistro: fechaHoy,
        vencimiento: "",
        estado: true
    };

    const [nuevoSocio, setNuevoSocio] = useState(modeloSocioVacio);


// ----------------------------------------------------------------------
    const handleExportar = (tipo) => {
    const datosAExportar = sociosFiltrados.map(socio => ({
        ID: socio.id ?? socio.Id,
        Nombre: socio.nombreCompleto ?? socio.NombreCompleto,
        Teléfono: socio.telefono ?? socio.Telefono,
        Pago: socio.descuento ?? socio.Descuento,
        "Fecha Registro": socio.fechaRegistro ? new Date(socio.fechaRegistro).toLocaleDateString() : "",
        Vencimiento: socio.vencimiento ? new Date(socio.vencimiento).toLocaleDateString() : "",
        Estado: (socio.estado ?? socio.Estado) ? "Activo" : "Inactivo"
    }));

    const ws = XLSX.utils.json_to_sheet(datosAExportar);
    const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Socios');

        if (tipo === 'excel') {
            XLSX.writeFile(wb, 'Reporte_Socios.xlsx');
        } else if (tipo === 'csv') {
            XLSX.writeFile(wb, 'Reporte_Socios.csv', { bookType: 'csv' });
        }
    };

    const cambiarMensaje = (texto, tipo = "info") => {
        setMensajePantalla({ texto, tipo });
        setTimeout(() => {
            setMensajePantalla({ texto: "", tipo: "" });
        }, 3000); 
    };

    const obtenerSocios = async () => {
    try {
        const response = await fetch(
            "https://localhost:7099/api/socios"
        );
        if (!response.ok) {
            throw new Error("Error al obtener socios");
        }
        const data = await response.json();
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        // Revisar vencimientos
        for (const socio of data) {
            const id = socio.id ?? socio.Id;
            const vencimiento = new Date(
                socio.vencimiento ?? socio.Vencimiento
            );
            vencimiento.setHours(0, 0, 0, 0);
            const estadoActual =
                socio.estado ?? socio.Estado;
            // Si ya venció y sigue activo
            if (vencimiento < hoy && estadoActual) {
                const socioActualizado = {
                    id: id,
                    nombreCompleto:
                        socio.nombreCompleto ??
                        socio.NombreCompleto,
                    telefono:
                        socio.telefono ??
                        socio.Telefono,
                    descuento:
                        socio.descuento ??
                        socio.Descuento,
                    fechaRegistro:
                        socio.fechaRegistro ??
                        socio.FechaRegistro,
                    vencimiento:
                        socio.vencimiento ??
                        socio.Vencimiento,
                    estado: false
                };
                await fetch(
                    `https://localhost:7099/api/socios/${id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(socioActualizado)
                    }
                );
                socio.estado = false;
            }
        }
        setSocios(data);
    } catch (error) {
        console.error(error);
        cambiarMensaje(
            "Error al conectar con el servidor para leer socios.",
            "danger"
        );
    }
};

    const prepararEdicion = (socio) => {
        const idSocio = socio.id !== undefined ? socio.id : socio.Id;
        const nombre = socio.nombreCompleto !== undefined ? socio.nombreCompleto : socio.NombreCompleto;
        const tel = socio.telefono !== undefined ? socio.telefono : socio.Telefono;
        const desc = socio.descuento !== undefined ? socio.descuento : socio.Descuento;
        const fReg = socio.fechaRegistro !== undefined ? socio.fechaRegistro : socio.FechaRegistro;
        const fVenc = socio.vencimiento !== undefined ? socio.vencimiento : socio.Vencimiento;
        const est = socio.estado !== undefined ? socio.estado : socio.Estado;

        setSocioEditandoId(idSocio);
        setNuevoSocio({
            nombreCompleto: nombre || "",
            telefono: tel || "",
            descuento: desc !== undefined && desc !== null ? String(desc) : "", 
            fechaRegistro: fReg ? fReg.split('T')[0] : fechaHoy,
            vencimiento: fVenc ? fVenc.split('T')[0] : fechaHoy,
            estado: est ?? true
        });
        setConfirmarEliminarId(null);
        setMensajePantalla({ texto: "", tipo: "" });
        setVista('agregar'); 
    };
    const guardarSocio = async (e) => {
        e.preventDefault();
        const esEdicion = socioEditandoId !== null;
        
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

const fechaVencimiento = new Date(
    nuevoSocio.vencimiento
);

fechaVencimiento.setHours(0, 0, 0, 0);

if (fechaVencimiento < hoy) {
    cambiarMensaje(
        "La fecha de vencimiento no puede ser menor a hoy.",
        "danger"
    );
    return;
}   
        const url = esEdicion 
            ? `https://localhost:7099/api/socios/${socioEditandoId}` 
            : "https://localhost:7099/api/socios";
            /* ? `https://localhost:44348/api/socios/${socioEditandoId}`
            : "https://localhost:44348/api/socios";*/
        
        const metodo = esEdicion ? "PUT" : "POST";

        const socioAEnviar = {
            NombreCompleto: nuevoSocio.nombreCompleto,
            Telefono: nuevoSocio.telefono,
            Descuento: nuevoSocio.descuento === "" ? "440" : String(nuevoSocio.descuento),
            FechaRegistro: nuevoSocio.fechaRegistro,
            Vencimiento: nuevoSocio.vencimiento,
            Estado: nuevoSocio.estado
        };
        
        const cuerpoPeticion = esEdicion 
            ? { ...socioAEnviar, Id: socioEditandoId } 
            : socioAEnviar;

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpoPeticion)
            });

            if (response.ok) {
                await obtenerSocios();
                cambiarMensaje(
                    esEdicion ? "Socio actualizado exitosamente" : "Socio creado exitosamente", 
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

    const eliminarSocio = async (id) => {
        try {
            const response = await fetch(`https://localhost:7099/api/socios/${id}`, {
            //const response = await fetch(`https://localhost:44348/api/socios/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                await obtenerSocios();
                setConfirmarEliminarId(null);
                cambiarMensaje("Registro de socio eliminado del sistema", "warning");
            } else {
                cambiarMensaje("El servidor denegó la eliminación del socio.", "danger");
            }
        } catch (error) {
            console.error(error);
            cambiarMensaje("Error de conexión al intentar eliminar.", "danger");
        }
    };

    const cancelarFormulario = () => {
        setNuevoSocio(modeloSocioVacio);
        setSocioEditandoId(null);
        setVista('tabla');
    };

    useEffect(() => {
        obtenerSocios();
    }, []);

    //filtrado y Ordenado
    const sociosFiltrados = socios.filter((socio) => {
        const nombre = socio.nombreCompleto !== undefined ? socio.nombreCompleto : socio.NombreCompleto;
        const cumpleBusqueda = (nombre || "").toLowerCase().includes(busqueda.toLowerCase());
        //por Estado
        const est = socio.estado !== undefined ? socio.estado : socio.Estado;
        let cumpleEstado = true;
        if (filtroEstado === "activo") cumpleEstado = est === true;
        if (filtroEstado === "inactivo") cumpleEstado = est === false;
        //por Vencimiento
        let cumpleVencimiento = true;
        const fVencRaw = socio.vencimiento !== undefined ? socio.vencimiento : socio.Vencimiento;
        if (filtroVencimiento !== "todos") {
            if (!fVencRaw) {
                cumpleVencimiento = false; 
            } else {
                const fechaVenc = new Date(fVencRaw);
                fechaVenc.setHours(0, 0, 0, 0); 
                
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                
                const unaSemana = new Date(hoy);
                unaSemana.setDate(unaSemana.getDate() + 7);
                if (filtroVencimiento === "vencido") {
                    cumpleVencimiento = fechaVenc < hoy;
                } else if (filtroVencimiento === "proxima_semana") {
                    cumpleVencimiento = fechaVenc >= hoy && fechaVenc <= unaSemana;
                }
            }
        }

        return cumpleBusqueda && cumpleEstado && cumpleVencimiento;

    });

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            
            {vista === 'tabla' && (
                <Container fluid className="py-4 text-light">
                    <div className="d-flex gap-2 mb-3">
                        <Button onClick={() => handleExportar('csv')} variant="success">
                            <i className="fa-solid fa-file-csv me-2"></i>Exportar a CSV
                        </Button>
                    </div>
                    
                    <Row className="mb-4">
                        <Col>
                            <div className="d-flex justify-content-between align-items-center p-4 rounded header-container-custom">
                                <div>
                                    <h1 className="text-accent-green fw-bold mb-1">Socios</h1>
                                    <p className="text-muted-gray mb-0">Gestión de socios</p>
                                    {mensajePantalla.texto && (
                                        <small className={`fw-semibold text-${mensajePantalla.tipo} d-block mt-1`}>
                                            {mensajePantalla.texto}
                                        </small>
                                    )}
                                </div>
                                <Button 
                                    className="btn-accent-success"
                                    onClick={() => { 
                                        setSocioEditandoId(null); 
                                        setConfirmarEliminarId(null);
                                        setMensajePantalla({ texto: "", tipo: "" });
                                        setVista('agregar'); 
                                    }}
                                >
                                    <i className="fa-solid fa-user-plus me-2"></i>+ Agregar Socio
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    {/*filtros*/}
                    <Row className="mb-4">
                        <Col>
                            <Card className="custom-card-dark">
                                <Card.Body className="d-flex flex-column flex-md-row gap-3">
                                    {/*por texto*/}
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar socio..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        className="custom-input-dark flex-grow-1"
                                    />
                                    {/*por Estado*/}
                                    <Form.Select 
                                        value={filtroEstado} 
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                        className="custom-input-dark w-auto"
                                    >
                                        <option value="todos">Todos los estados</option>
                                        <option value="activo">Activos</option>
                                        <option value="inactivo">Inactivos</option>
                                    </Form.Select>
                                    {/*por Vencimiento*/}
                                    <Form.Select 
                                        value={filtroVencimiento} 
                                        onChange={(e) => setFiltroVencimiento(e.target.value)}
                                        className="custom-input-dark w-auto"
                                    >
                                        <option value="todos">Cualquier fecha</option>
                                        <option value="vencido">Ya venció</option>
                                        <option value="proxima_semana">Vence en ≤ 1 semana</option>
                                    </Form.Select>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Tabla Socios */}
                    <Row>
                        <Col>
                            <Card className="custom-card-dark">
                                <Card.Body className="p-0">
                                    <Table striped bordered hover responsive variant="dark" className="custom-table-dark mb-0">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Teléfono</th>
                                                <th>Pago</th>
                                                <th>Registro</th>
                                                <th>Vencimiento</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sociosFiltrados.map((socio) => {
                                                const idSocio = socio.id !== undefined ? socio.id : socio.Id;
                                                const nombre = socio.nombreCompleto !== undefined ? socio.nombreCompleto : socio.NombreCompleto;
                                                const tel = socio.telefono !== undefined ? socio.telefono : socio.Telefono;
                                                const desc = socio.descuento !== undefined ? socio.descuento : socio.Descuento;
                                                const fReg = socio.fechaRegistro !== undefined ? socio.fechaRegistro : socio.FechaRegistro;
                                                const fVenc = socio.vencimiento !== undefined ? socio.vencimiento : socio.Vencimiento;
                                                const est = socio.estado !== undefined ? socio.estado : socio.Estado;

                                                return (
                                                    <tr key={idSocio}>
                                                        <td>{idSocio}</td>
                                                        <td>{nombre}</td>
                                                        <td>{tel}</td>
                                                        <td>{desc}</td>
                                                        <td>{fReg ? new Date(fReg).toLocaleDateString() : ""}</td>
                                                        <td>{fVenc ? new Date(fVenc).toLocaleDateString() : ""}</td>
                                                        <td>
                                                            {est ? (
                                                                <span className="text-accent-green fw-semibold">Activo</span>
                                                            ) : (
                                                                <span className="text-danger fw-semibold">Inactivo</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {confirmarEliminarId === idSocio ? (
                                                                // Interfaz Inline de confirmación de borrado
                                                                <div className="d-flex justify-content-center align-items-center gap-1">
                                                                    <Button 
                                                                        variant="danger" 
                                                                        size="sm"
                                                                        onClick={() => eliminarSocio(idSocio)}
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
                                                                // Acciones por defecto
                                                                <>
                                                                    <Button 
                                                                        className="btn-outline-accent-success me-2" 
                                                                        size="sm"
                                                                        onClick={() => prepararEdicion(socio)}
                                                                    >
                                                                        Editar
                                                                    </Button>
                                                                    <Button 
                                                                        variant="outline-danger" 
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setConfirmarEliminarId(idSocio);
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
                                    {socioEditandoId !== null ? 'Editar Socio' : 'Agregar Socio'}
                                </h2>
                                {mensajePantalla.texto && (
                                    <small className={`fw-semibold text-${mensajePantalla.tipo} d-block mt-1`}>
                                        {mensajePantalla.texto}
                                    </small>
                                )}
                            </div>
                            <button className="boton-cerrar btn btn-sm btn-outline-secondary text-white" onClick={cancelarFormulario}>&times;</button>
                        </div>
                        
                        <form className="formulario row g-3" onSubmit={guardarSocio}>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Nombre Completo:</label>
                                <input
                                    type="text"
                                    name="nombreCompleto"
                                    placeholder="Ej: Juan Pérez"
                                    value={nuevoSocio.nombreCompleto}
                                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, nombreCompleto: e.target.value })}
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
                                    value={nuevoSocio.telefono}
                                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, telefono: e.target.value })}
                                    className="form-control bg-black text-white border-secondary"
                                    required
                                />
                            </div>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Pago ($):</label>
                                <input
                                    type="text" 
                                    name="descuento"
                                    placeholder="Ej: 50"
                                    value={nuevoSocio.descuento}
                                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, descuento: e.target.value })}
                                    className="form-control bg-black text-white border-secondary"
                                />
                            </div>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Estado del Socio:</label>
                                <select
                                    name="estado"
                                    value={nuevoSocio.estado}
                                    onChange={(e) => setNuevoSocio(prev => ({ ...prev, estado: e.target.value === "true" }))}
                                    className="form-select bg-black text-white border-secondary"
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Fecha de Registro:</label>
                                <input
                                    type="date"
                                    name="fechaRegistro"
                                    value={nuevoSocio.fechaRegistro}
                                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, fechaRegistro: e.target.value })}
                                    className="form-control bg-black text-white border-secondary"
                                    required
                                />
                            </div>
                            <div className="grupo-entrada col-md-6">
                                <label className="form-label text-lima fw-bold">Fecha de Vencimiento:</label>
                                <input
                                    type="date"
                                    name="vencimiento"
                                    value={nuevoSocio.vencimiento}
                                    min={fechaHoy}
                                    onChange={(e) => setNuevoSocio({ ...nuevoSocio, vencimiento: e.target.value })}
                                    className="form-control bg-black text-white border-secondary"
                                    required
                                />
                            </div>
                            <div className="col-12 mt-4 d-flex gap-2">
                                <Button type="submit" className="btn-accent-success flex-grow-1 fw-bold py-2">
                                    {socioEditandoId !== null ? 'Guardar Cambios' : 'Guardar Socio'}
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

export default Socios;