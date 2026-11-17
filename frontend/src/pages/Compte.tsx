import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/style.css';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

const Compte: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingInfos, setLoadingInfos] = useState(false);
  const [loadingMdp, setLoadingMdp] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/compte');
      setUser(response.data);
      setNom(response.data.nom);
      setPrenom(response.data.prenom);
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleUpdateInfos = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingInfos(true);

    try {
      await api.put('/compte/infos', { nom, prenom, email });
      setSuccess('Informations mises à jour avec succès.');
      fetchUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoadingInfos(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingMdp(true);

    try {
      await api.put('/compte/password', {
        ancienMotDePasse,
        nouveauMotDePasse,
        confirmationMotDePasse
      });
      setSuccess('Mot de passe modifié avec succès.');
      setAncienMotDePasse('');
      setNouveauMotDePasse('');
      setConfirmationMotDePasse('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setLoadingMdp(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4">Mon compte</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Informations personnelles</h4>
          <Form onSubmit={handleUpdateInfos}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="form-label">Prénom</Form.Label>
                <Form.Control
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="form-label">Nom</Form.Label>
                <Form.Control
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </Col>
              <Col md={12}>
                <Form.Label className="form-label">Adresse email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Col>
            </Row>
            <div className="d-grid mt-3">
              <Button type="submit" className="btn-success" disabled={loadingInfos}>
                {loadingInfos ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </Form>
        </Card>

        <Card className="card-tw p-4">
          <h4 className="mb-3">Changer le mot de passe</h4>
          <Form onSubmit={handleChangePassword}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Label className="form-label">Mot de passe actuel</Form.Label>
                <Form.Control
                  type="password"
                  value={ancienMotDePasse}
                  onChange={(e) => setAncienMotDePasse(e.target.value)}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="form-label">Nouveau mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={nouveauMotDePasse}
                  onChange={(e) => setNouveauMotDePasse(e.target.value)}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="form-label">Confirmer le nouveau mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmationMotDePasse}
                  onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                  required
                />
              </Col>
            </Row>
            <div className="d-grid mt-3">
              <Button type="submit" className="btn-success" disabled={loadingMdp}>
                {loadingMdp ? 'Changement...' : 'Changer le mot de passe'}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default Compte;
