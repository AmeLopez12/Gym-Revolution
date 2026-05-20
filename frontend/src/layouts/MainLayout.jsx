import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: '#f0f0f0' }}>
      <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
            REVOLUTION FITNESS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/socios" active={location.pathname === '/socios'}>Socios</Nav.Link>
              <Nav.Link as={Link} to="/actividades" active={location.pathname === '/actividades'}>Actividades</Nav.Link>
              <Nav.Link as={Link} to="/instructores" active={location.pathname === '/instructores'}>Instructores</Nav.Link>
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