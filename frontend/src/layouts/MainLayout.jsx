import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './MainLayout.css';

const MainLayout = () => {
  const location = useLocation();
  const getLinkClass = (path) => {
    return location.pathname === path 
      ? 'nav-link-custom active-tab px-4' 
      : 'nav-link-custom px-4';
  };

  return (
    <div className="main-layout-container">
      <Navbar expand="lg" className="custom-navbar mb-4">
        <Container fluid className="max-width-1400 px-4">
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2 navbar-brand-custom">
            <span>REVOLUTION FITNESS</span>
            <i className="fa-solid fa-users" style={{ fontSize: '1.5rem' }}></i>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/socios" 
                className={getLinkClass('/socios')}>
                Socios
              </Nav.Link>
              <Nav.Link as={Link} to="/actividades" 
                className={getLinkClass('/actividades')}>
                Actividades
              </Nav.Link>
              <Nav.Link as={Link} to="/instructores" 
                className={getLinkClass('/instructores')}>
                Instructores
              </Nav.Link>
              
              <div className="d-flex flex-column align-items-center ms-lg-4 mt-3 mt-lg-0 user-actions-container">
                <span>Bienvenido Recepción</span>
                <Link to="/login" className="logout-link">
                  Cerrar Sesión
                </Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="content-wrapper">
        <Outlet />
      </Container>
    </div>
  );
};

export default MainLayout;