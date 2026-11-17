import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import '../styles/style.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-card p-4 rounded-4 shadow">
        <h1 className="text-center mb-1">TensionWatch</h1>
        <p className="sous-titre text-center mb-4">Suivi médical pour proches aidants</p>

        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-grid mb-3">
            <Button type="submit" className="btn-success" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </div>
        </Form>

        <div className="text-center">
          <Link to="/register" className="d-block mb-1" style={{color: '#048b9a', textDecoration: 'none', fontSize: '12px'}}>
            Pas encore de compte ? Inscrivez-vous
          </Link>
          <Link to="#" className="d-block" style={{color: '#048b9a', textDecoration: 'none', fontSize: '12px'}}>
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
