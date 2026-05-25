import { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card
} from "react-bootstrap";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import "./Estilos/estadisticas.css";

function Estadisticas() {

    const [inscripciones, setInscripciones] =
        useState([]);

    useEffect(() => {

        obtenerInscripciones();

    }, []);

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

    const actividadesMap = {};

    inscripciones.forEach((i) => {

        const nombre =
            i.actividad?.nombre ||
            "Sin actividad";

        actividadesMap[nombre] =
            (actividadesMap[nombre] || 0) + 1;
    });

    const actividadesData =
        Object.entries(actividadesMap).map(
            ([nombre, total]) => ({
                nombre,
                total
            })
        );

    const instructoresMap = {};

    inscripciones.forEach((i) => {

        const instructor =
            i.actividad?.instructor?.nombreCompleto
            ||
            "Sin instructor";

        instructoresMap[instructor] =
            (instructoresMap[instructor] || 0) + 1;
    });

    const instructoresData =
        Object.entries(instructoresMap).map(
            ([nombre, total]) => ({
                nombre,
                total
            })
        );

    const horariosMap = {};

    inscripciones.forEach((i) => {

        const hora =
            i.horarioActividad?.horaInicio
                ?.substring(0, 5)
            ||
            "Sin hora";

        horariosMap[hora] =
            (horariosMap[hora] || 0) + 1;
    });

    const horariosData =
        Object.entries(horariosMap).map(
            ([hora, total]) => ({
                hora,
                total
            })
        );

    const COLORS = [
        "#39ff14",
        "#00c853",
        "#64dd17",
        "#76ff03",
        "#aeea00"
    ];

    return (

        <Container
            fluid
            className="estadisticas-container py-4"
        >

            <Row className="mb-4">

                <Col>

                    <div className="estadisticas-header">

                        <h1 className="estadisticas-title">
                            ESTADÍSTICAS
                        </h1>

                        <p className="estadisticas-subtitle">
                            Reportes y métricas del gimnasio
                        </p>

                    </div>

                </Col>

            </Row>

            <Row className="g-4 mb-4">

                <Col lg={6}>

                    <Card className="custom-card-dark h-100">

                        <Card.Body>

                            <h4 className="text-accent-green mb-4">
                                Actividades más populares
                            </h4>

                            <div className="chart-container">

                                <ResponsiveContainer
                                    width="100%"
                                    height={320}

                                >

                                    <BarChart
                                        data={actividadesData}
                                    >

                                        <XAxis dataKey="nombre" />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar
                                            dataKey="total"
                                            fill="#aaff00"
                                            radius={[6, 6, 0, 0]}
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

                <Col lg={6}>

                    <Card className="custom-card-dark h-100">

                        <Card.Body>

                            <h4 className="text-accent-green mb-4">
                                Instructores más populares
                            </h4>

                            <div className="chart-container">

                                <ResponsiveContainer
                                    width="100%"
                                    height={320}
                                >

                                    <PieChart>

                                        <Pie
                                            data={instructoresData}
                                            dataKey="total"
                                            nameKey="nombre"
                                            outerRadius={100}
                                            label
                                        >

                                            {
                                                instructoresData.map(
                                                    (_, index) => (

                                                        <Cell
                                                            key={index}
                                                            fill={
                                                                COLORS[
                                                                index %
                                                                COLORS.length
                                                                ]
                                                            }
                                                        />

                                                    )
                                                )
                                            }

                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

            <Row>

                <Col>

                    <Card className="custom-card-dark">

                        <Card.Body>

                            <h4 className="text-accent-green mb-4">
                                Horarios más populares
                            </h4>

                            <div className="chart-container">

                                <ResponsiveContainer
                                    width="100%"
                                    height={320}
                                >

                                    <BarChart
                                        data={horariosData}
                                    >

                                        <XAxis dataKey="hora" />

                                        <YAxis />

                                        <Tooltip />

                                        <Bar
                                            dataKey="total"
                                            fill="#00c853"
                                            radius={[6, 6, 0, 0]}
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

        </Container>
    );
}

export default Estadisticas;