import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Socios from "./pages/Socios";
import Actividades from "./pages/Actividades";
import Instructores from "./pages/Instructores";
import Inscripciones from "./pages/Inscripciones";
import Estadisticas from "./pages/Estadisticas";

import PrivadaLayout from "./components/PrivadaLayout";

function App() {

    return (

        <BrowserRouter>

            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* RUTAS PRIVADAS */}
                <Route
                    path="/"
                    element={
                        <PrivadaLayout>

                            <MainLayout />

                        </PrivadaLayout>
                    }
                >

                    <Route
                        index
                        element={<Dashboard />}
                    />

                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />
                    <Route
                        path="socios"
                        element={<Socios />}
                    />

                    <Route
                        path="actividades"
                        element={<Actividades />}
                    />

                    <Route
                        path="instructores"
                        element={<Instructores />}
                    />

                    <Route
                        path="inscripciones"
                        element={<Inscripciones />}
                    />

                    <Route
                        path="estadisticas"
                        element={<Estadisticas />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
