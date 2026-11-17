import React from 'react';
import { Navbar as BsNavbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/style.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <BsNavbar className="navbar-tw" expand="lg">
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/dashboard" className="navbar-brand">
          TensionWatch
        </BsNavbar.Brand>
        <Nav className="ms-auto align-items-center">
          <Nav.Link as={Link} to="/compte" className="me-3 text-white text-decoration-none">
            Bonjour, {user?.prenom}
          </Nav.Link>
          <button onClick={logout} className="btn btn-sm btn-light">
            Déconnexion
          </button>
        </Nav>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
