import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/style.css';

const Patient: React.FC = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [groupeSanguin, setGroupeSanguin] = useState('');
  const [poids, setPoids] = useState('');
  const [medecin, setMedecin] = useState('');
  const [antecedants, setAntecedants] = useState('');
  const [hasPatient, setHasPatient] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const groupes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      const response = await api.get('/patient');
      if (response.data.id) {
        setHasPatient(true);
        setNom(response.data.nom);
        setPrenom(response.data.prenom);
        setDateDeNaissance(response.data.dateDeNaissance || '');
        setGroupeSanguin(response.data.groupeSanguin || '');
        setPoids(response.data.poids || '');
        setMedecin(response.data.medecin || '');
        setAntecedants(response.data.antecedants || '');
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!nom || !prenom) {
      setError('Le nom et le prénom du patient sont obligatoires.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/patient', {
        nom,
        prenom,
        dateDeNaissance: dateDeNaissance || null,
        groupeSanguin: groupeSanguin || null,
        poids: poids || null,
        medecin,
        antecedants
      });
      setSuccess(hasPatient ? 'Profil patient mis à jour avec succès.' : 'Patient créé avec succès.');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4">{hasPatient ? 'Modifier le profil patient' : 'Ajouter un patient'}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="card-tw p-4">
          <Form onSubmit={handleSubmit}>
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
              <Col md={4}>
                <Form.Label className="form-label">Date de naissance</Form.Label>
                <Form.Control
                  type="date"
                  value={dateDeNaissance}
                  onChange={(e) => setDateDeNaissance(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label className="form-label">Groupe sanguin</Form.Label>
                <Form.Select value={groupeSanguin} onChange={(e) => setGroupeSanguin(e.target.value)}>
                  <option value="">-- Sélectionner --</option>
                  {groupes.map(g => <option key={g} value={g}>{g}</option>)}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label className="form-label">Poids (kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={poids}
                  onChange={(e) => setPoids(e.target.value)}
                />
              </Col>
              <Col md={12}>
                <Form.Label className="form-label">Médecin traitant</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nom du médecin"
                  value={medecin}
                  onChange={(e) => setMedecin(e.target.value)}
                />
              </Col>
              <Col md={12}>
                <Form.Label className="form-label">Antécédents médicaux</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="ex: Hypertension depuis 2018, diabète type 2..."
                  value={antecedants}
                  onChange={(e) => setAntecedants(e.target.value)}
                />
              </Col>
            </Row>
            <div className="d-grid mt-4">
              <Button type="submit" className="btn-success" disabled={loading}>
                {loading ? 'Enregistrement...' : (hasPatient ? 'Enregistrer les modifications' : 'Créer le patient')}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default Patient;
