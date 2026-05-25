import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "./Estilos/login.css";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError(
                "Completa todos los campos"
            );
            return;
        }

        try {

            const data = {
                Username: username,
                Password: password
            }
            console.log(data);
            
            const response = await fetch(
                "https://localhost:7099/api/Usuarios/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (response.ok) {
                const usuario =
                    await response.json();
                localStorage.setItem(
                    "usuario",
                    JSON.stringify(usuario)
                );
                navigate("/dashboard");
            }
            else {
                setError(
                    "Usuario o contraseña incorrectos"
                );
            }
        } catch (error) {
            console.error(error);
            setError(
                "Error de conexión"
            );
        }
    };

    // =========================
    return (

        <Container fluid className="login-container">
            <Row className="w-100 justify-content-center">
                
                <Col md={5} lg={4}>
                    <Card className="login-card">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h1 className="login-title">
                                    REVOLUTION FITNESS
                                </h1>
                                <p className="login-subtitle">
                                    Sistema de Gestión de Gimnasio
                                </p>
                            </div>

                            <Form onSubmit={iniciarSesion}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="login-label">
                                        Usuario
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(
                                                e.target.value
                                            )
                                        }
                                        className="login-input"
                                        placeholder="Ingresa tu usuario"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="login-label">
                                        Contraseña
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        className="login-input"
                                        placeholder="Ingresa tu contraseña"
                                    />

                                </Form.Group>

                                {
                                    error && (
                                        <div className="login-error">
                                            {error}
                                        </div>
                                    )
                                }

                                <Button
                                    type="submit"
                                    className="login-button w-100"
                                >
                                    Iniciar sesión
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;