import { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Button
} from "react-bootstrap";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

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

    const chartRef1 = useRef();
    const chartRef2 = useRef();
    const chartRef3 = useRef();
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

    // ------------------------------------
    const exportarGraficaPDF = async (ref, nombreArchivo, tituloReporte) => {
        const elemento = ref.current;
        if (!elemento) return;

        try {
            const canvas = await html2canvas(elemento, {
                scale: 2, 
                backgroundColor: "#121212", 
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL("image/png");
            
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            const anchoPdf = pdf.internal.pageSize.getWidth();
            const altoPdf = pdf.internal.pageSize.getHeight();

            const margen = 15;
            const anchoUtil = anchoPdf - (margen * 2);
            
            const proporcionImg = canvas.height / canvas.width;
            const altoImgCalculado = anchoUtil * proporcionImg;

            pdf.setFillColor(18, 18, 18);
            pdf.rect(0, 0, anchoPdf, 25, "F");
            
            pdf.setTextColor(57, 255, 20); 
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.text("REPORTE REVOLUTION FITNESS - GESTIÓN DE GYM", margen, 16);

            pdf.setTextColor(255, 255, 255);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.text(`Gráfica: ${tituloReporte}`, margen + 110, 15);
            pdf.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, anchoPdf - margen - 60, 15);

            pdf.setDrawColor(57, 255, 20);
            pdf.setLineWidth(0.5);
            pdf.line(margen, 25, anchoPdf - margen, 25);

            const posicionY = 35;
            pdf.addImage(imgData, "PNG", margen, posicionY, anchoUtil, altoImgCalculado);

            pdf.save(`${nombreArchivo}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Error generando el PDF de la estadística:", error);
        }
    };

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

                            <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => exportarGraficaPDF(chartRef1, "Actividades_Populares", "Distribución de Actividades")}
                                    >
                                <i className="fa-solid fa-file-pdf me-1"></i> PDF
                            </Button>

                            <div ref={chartRef1} className="chart-container">

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

                            <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => exportarGraficaPDF(chartRef2, "Instructores_Populares", "Demanda por Instructores")}
                                >
                                <i className="fa-solid fa-file-pdf me-1"></i> PDF
                            </Button>

                            <div ref={chartRef2} className="chart-container">

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

                            <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => exportarGraficaPDF(chartRef3, "Horarios_Populares", "Mayor demanda por Horarios de Inicio")}
                                >
                                <i className="fa-solid fa-file-pdf me-1"></i> PDF
                            </Button>



                            <div ref={chartRef3} className="chart-container">

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