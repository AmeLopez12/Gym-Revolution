import { useEffect, useState } from "react";

function Socios() {

    const [socios, setSocios] = useState([]);

    const obtenerSocios = async () => {

        const response = await fetch(
            "https://localhost:7099/api/socios"
        );

        const data = await response.json();

        setSocios(data);
    };

    useEffect(() => {
        obtenerSocios();
    }, []);

    return (
        <div>
            <h1>Socios</h1>

            {
                socios.map((socio) => (
                    <div key={socio.id}>
                        <p>{socio.nombre}</p>
                        <p>{socio.correo}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default Socios;