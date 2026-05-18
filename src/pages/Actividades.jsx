import React, { useState } from 'react';
import './actividades.css'; 

const Actividades = () => {
    const [vista, setVista] = useState('tabla'); 

    const listaActividades = [
        { id: 10, nombre: 'Yoga Flow', horario: '07 Feb 18:00', duracion: '60 min', instructor: 'Elena Rivas', precio: '$150', cupo: '12/20' }
    ];

    const RenderTabla = () => (
        <div className="container mt-4">
            <header className="barra-superior d-flex justify-content-between align-items-center p-3 rounded mb-4">
                <div className="logo-contenedor">
                    <h1 className="titulo-pagina m-0"> Actividades <i className="fa-solid fa-dumbbell"></i></h1>
                </div>
                <div className="acciones-usuario">
                    <button className="boton-primario btn btn-success fw-bold" onClick={() => setVista('agregar')}>+ Agregar Actividad</button>
                </div>
            </header>

            <section className="seccion-busqueda bg-dark p-4 rounded mb-4 shadow">
                <div className="cabecera-busqueda row align-items-center">
                    <div className="col-md-4">
                        <h2 className="text-white h4 m-0">Buscar Instructor</h2>
                    </div>
                    <div className="col-md-8">
                        <div className="grupo-entrada input-group">
                            <input type="text" placeholder="Busca instructor por ID..." className="entrada-texto form-control bg-black text-white border-secondary" />
                            <button className="boton-busqueda btn btn-outline-success">Buscar</button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="contenedor-tabla table-responsive shadow rounded">
                <table className="table table-dark table-hover align-middle m-0">
                    <thead className="text-success border-secondary">
                        <tr>
                            <th>ID</th><th>Nombre</th><th>Horario</th><th>Duración</th>
                            <th>Instructor</th><th>Precio</th><th>Cupo</th><th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="border-secondary">
                        {listaActividades.map(act => (
                            <tr key={act.id}>
                                <td>{act.id}</td>
                                <td>{act.nombre}</td>
                                <td>{act.horario}</td>
                                <td>{act.duracion}</td>
                                <td>{act.instructor}</td>
                                <td>{act.precio}</td>
                                <td>{act.cupo}</td>
                                <td className="text-center">
                                    <div className="btn-group gap-2">
                                        <button className="btn btn-sm btn-outline-info fw-bold" onClick={() => setVista('inscribir')}>Inscribir</button>
                                        <button className="btn btn-sm btn-outline-warning fw-bold" onClick={() => setVista('agregar')}>Editar</button>
                                        <button className="btn btn-sm btn-outline-danger fw-bold">Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const RenderAgregar = () => (
        <div className="contenedor-formulario d-flex justify-content-center align-items-center py-5">
            <div className="bloque-formulario card bg-dark text-white p-4 shadow-lg border-secondary" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="encabezado-formulario d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
                    <h2 className="text-lima h3">Agregar Actividad</h2>
                    <button className="boton-cerrar btn btn-sm btn-outline-secondary text-white" onClick={() => setVista('tabla')}>&times;</button>
                </div>
                <form className="formulario row g-3">
                    <div className="grupo-entrada col-12">
                        <label className="form-label text-lima fw-bold">Nombre de la Actividad:</label>
                        <input type="text" className="form-control bg-black text-white border-secondary" required placeholder="Ej: Yoga Flow" />
                    </div>
                    <div className="grupo-entrada col-md-6">
                        <label className="form-label text-lima fw-bold">Horario:</label>
                        <input type="datetime-local" className="form-control bg-black text-white border-secondary" required />
                    </div>
                    <div className="grupo-entrada col-md-6">
                        <label className="form-label text-lima fw-bold">Duración (minutos):</label>
                        <input type="number" className="form-control bg-black text-white border-secondary" required placeholder="Ej: 60" />
                    </div>
                    <div className="grupo-entrada col-12">
                        <label className="form-label text-lima fw-bold">Instructor:</label>
                        <input type="text" className="form-control bg-black text-white border-secondary" required placeholder="Ej: Elena Rivas" />
                    </div>
                    <div className="grupo-entrada col-md-6">
                        <label className="form-label text-lima fw-bold">Precio ($):</label>
                        <input type="number" className="form-control bg-black text-white border-secondary" required placeholder="Ej: 150" />
                    </div>
                    <div className="grupo-entrada col-md-6">
                        <label className="form-label text-lima fw-bold">Cupo Máximo:</label>
                        <input type="number" className="form-control bg-black text-white border-secondary" required placeholder="Ej: 20" />
                    </div>
                    <div className="col-12 mt-4">
                        <button type="submit" className="boton-primario btn btn-success w-100 fw-bold py-2">Agregar Actividad</button>
                    </div>
                </form>
            </div>
        </div>
    );

    const RenderInscribir = () => (
        <div className="contenedor-formulario d-flex justify-content-center align-items-center py-5">
            <div className="bloque-formulario card bg-dark text-white p-4 shadow-lg border-secondary" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="encabezado-formulario d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
                    <h2 className="text-info text-lima h3">Inscribir Socio</h2>
                    <button className="boton-cerrar btn btn-sm btn-outline-secondary text-white" onClick={() => setVista('tabla')}>&times;</button>
                </div>
                <form className="formulario g-3">
                    <div className="grupo-entrada mb-3">
                        <label className="form-label text-lima fw-bold">Seleccionar Socio:</label>
                        <select className="form-select bg-black text-white border-secondary" required>
                            <option value="">-- Selecciona un socio --</option>
                            <option value="1">Juan Pérez</option>
                        </select>
                    </div>
                    <div className="grupo-entrada mb-3">
                        <label className="form-label text-lima fw-bold">Seleccionar Actividad:</label>
                        <select className="form-select bg-black text-white border-secondary" required>
                            <option value="">-- Selecciona una actividad --</option>
                            <option value="yoga">Yoga Flow</option>
                        </select>
                    </div>
                    <div className="grupo-entrada mb-4">
                        <label className="form-label text-lima fw-bold">Horario disponible:</label>
                        <select className="form-select bg-black text-white border-secondary" required>
                            <option value="">-- Selecciona un horario --</option>
                            <option value="1">Lunes 7:00 AM</option>
                        </select>
                    </div>
                    <button type="submit" className="boton-primario btn btn-info w-100 fw-bold text-white py-2">Inscribir Socio</button>
                </form>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
            {vista === 'tabla' && <RenderTabla />}
            {vista === 'agregar' && <RenderAgregar />}
            {vista === 'inscribir' && <RenderInscribir />}
        </div>
    );
};

export default Actividades;