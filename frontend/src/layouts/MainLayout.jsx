import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: '#f0f0f0' }}>
      <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold" style={{ color: "var(--verde-lima)"}}>
            REVOLUTION FITNESS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/socios" active={location.pathname === '/socios'} style={{ color: "white"}}>
                <i className="bi bi-people-fill"></i> Socios
              </Nav.Link>
              <Nav.Link as={Link} to="/actividades" active={location.pathname === '/actividades'} style={{ color: "white"}}>
                <i className="bi bi-calendar-event"></i> Actividades
              </Nav.Link>
              <Nav.Link as={Link} to="/instructores" active={location.pathname === '/instructores'} style={{ color: "white"}}>
                <i className="bi bi-person-badge-fill"></i> Instructores
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default MainLayout;