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

function Socios() {

    // =========================
    // STATES
    // =========================

    const [socios, setSocios] = useState([]);

    const [busqueda, setBusqueda] = useState("");

    const [nuevoSocio, setNuevoSocio] = useState({
        nombreCompleto: "",
        telefono: "",
        descuento: "",
        fechaRegistro: new Date().toISOString(),

    vencimiento: new Date().toISOString(),

        estado: true
    });

    // =========================
    // OBTENER SOCIOS
    // =========================

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

    // =========================
    // CREAR SOCIO
    // =========================

    const crearSocio = async () => {

        try {

            const response = await fetch(
                "https://localhost:7099/api/socios",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(nuevoSocio)
                }
            );

            if (response.ok) {

                await obtenerSocios();

                setNuevoSocio({
                    nombreCompleto: "",
                    telefono: "",
                    descuento: "",
                    fechaRegistro: "",
                    vencimiento: "",
                    estado: true
                });

                alert("Socio creado correctamente");

            }

        } catch (error) {

            console.error(error);

        }
    };

    // =========================
    // USE EFFECT
    // =========================

    useEffect(() => {

        obtenerSocios();

    }, []);

    // =========================
    // FILTRO
    // =========================

    const sociosFiltrados = socios.filter((socio) =>
        (socio.nombreCompleto || "")
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    // =========================
    // RENDER
    // =========================

    return (

        <Container fluid className="py-4 text-light">

            {/* HEADER */}

            <Row className="mb-4">

                <Col>

                    <div className="d-flex justify-content-between align-items-center bg-dark p-4 rounded border border-secondary">

                        <div>

                            <h1 className="text-success fw-bold">
                                SOCIOS
                            </h1>

                            <p className="text-secondary mb-0">
                                Gestión de socios registrados
                            </p>

                        </div>

                    </div>

                </Col>

            </Row>

            {/* FORMULARIO */}

            <Row className="mb-4">

                <Col>

                    <Card bg="dark" border="secondary">

                        <Card.Body>

                            <h4 className="text-success mb-4">
                                Nuevo Socio
                            </h4>

                            <Row className="g-3">

                                {/* NOMBRE */}

                                <Col md={4}>

                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre completo"
                                        value={nuevoSocio.nombreCompleto}
                                        onChange={(e) =>
                                            setNuevoSocio({
                                                ...nuevoSocio,
                                                nombreCompleto: e.target.value
                                            })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />

                                </Col>

                                {/* TELÉFONO */}

                                <Col md={4}>

                                    <Form.Control
                                        type="text"
                                        placeholder="Teléfono"
                                        value={nuevoSocio.telefono}
                                        onChange={(e) =>
                                            setNuevoSocio({
                                                ...nuevoSocio,
                                                telefono: e.target.value
                                            })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />

                                </Col>

                                {/* DESCUENTO */}

                                <Col md={4}>

                                    <Form.Control
                                        type="text"
                                        placeholder="Descuento"
                                        value={nuevoSocio.descuento}
                                        onChange={(e) =>
                                            setNuevoSocio({
                                                ...nuevoSocio,
                                                descuento: e.target.value
                                            })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />

                                </Col>

                                {/* FECHA REGISTRO */}

                                <Col md={6}>

                                    <Form.Control
                                        type="date"
                                        value={nuevoSocio.fechaRegistro}
                                        onChange={(e) =>
                                            setNuevoSocio({
                                                ...nuevoSocio,
                                                fechaRegistro: e.target.value
                                            })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />

                                </Col>

                                {/* VENCIMIENTO */}

                                <Col md={6}>

                                    <Form.Control
                                        type="date"
                                        value={nuevoSocio.vencimiento}
                                        onChange={(e) =>
                                            setNuevoSocio({
                                                ...nuevoSocio,
                                                vencimiento: e.target.value
                                            })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />

                                </Col>

                            </Row>

                            <div className="mt-4">

                                <Button
                                    variant="success"
                                    onClick={crearSocio}
                                >
                                    Guardar Socio
                                </Button>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            {/* BUSCADOR */}

            <Row className="mb-4">

                <Col>

                    <Card bg="dark" border="secondary">

                        <Card.Body>

                            <Form.Control
                                type="text"
                                placeholder="Buscar socio..."
                                value={busqueda}
                                onChange={(e) =>
                                    setBusqueda(e.target.value)
                                }
                                className="bg-black text-light border-secondary"
                            />

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            {/* TABLA */}

            <Row>

                <Col>

                    <Card bg="dark" border="secondary">

                        <Card.Body>

                            <Table
                                striped
                                bordered
                                hover
                                responsive
                                variant="dark"
                            >

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Teléfono</th>
                                        <th>Descuento</th>
                                        <th>Registro</th>
                                        <th>Vencimiento</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        sociosFiltrados.map((socio) => (

                                            <tr key={socio.id}>

                                                <td>{socio.id}</td>

                                                <td>{socio.nombreCompleto}</td>

                                                <td>{socio.telefono}</td>

                                                <td>{socio.descuento}</td>

                                                <td>
                                                    {
                                                        new Date(
                                                            socio.fechaRegistro
                                                        ).toLocaleDateString()
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        new Date(
                                                            socio.vencimiento
                                                        ).toLocaleDateString()
                                                    }
                                                </td>

                                                <td>

                                                    {
                                                        socio.estado
                                                            ? (
                                                                <span className="text-success">
                                                                    Activo
                                                                </span>
                                                            )
                                                            : (
                                                                <span className="text-danger">
                                                                    Inactivo
                                                                </span>
                                                            )
                                                    }

                                                </td>

                                                <td>

                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        className="me-2"
                                                    >
                                                        Editar
                                                    </Button>

                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                    >
                                                        Eliminar
                                                    </Button>

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
    );
}

export default Socios;