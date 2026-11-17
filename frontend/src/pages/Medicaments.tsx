import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Table } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/style.css';

interface Medicament {
  id: number;
  nom: string;
  dosage: string;
  frequence: string;
  heurePrise: string;
  dateDebut: string;
}

const Medicaments: React.FC = () => {
  const [nom, setNom] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequence, setFrequence] = useState('');
  const [heurePrise, setHeurePrise] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const fetchMedicaments = async () => {
    try {
      const response = await api.get('/medicament');
      setMedicaments(response.data);
    } catch (error) {
      console.error('Error fetching medicaments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!nom) {
      setError('Le nom du médicament est obligatoire.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/medicament', {
        nom,
        dosage,
        frequence,
        heurePrise: heurePrise || null,
        dateDebut: dateDebut || null
      });
      setSuccess('Médicament ajouté avec succès.');
      setNom('');
      setDosage('');
      setFrequence('');
      setHeurePrise('');
      setDateDebut('');
      fetchMedicaments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce médicament ?')) {
      try {
        await api.delete(`/medicament/${id}`);
        fetchMedicaments();
      } catch (error) {
        console.error('Error deleting medicament:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4">Traitements du patient</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Ajouter un médicament</h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label className="form-label">Nom du médicament</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: Amlodipine"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Form.Label className="form-label">Dosage</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: 5mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label">Fréquence</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: 1 fois par jour"
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label className="form-label">Heure de prise</Form.Label>
                <Form.Control
                  type="time"
                  value={heurePrise}
                  onChange={(e) => setHeurePrise(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label className="form-label">Date de début</Form.Label>
                <Form.Control
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                />
              </Col>
            </Row>
            <div className="d-grid mt-3">
              <Button type="submit" className="btn-success" disabled={loading}>
                {loading ? 'Ajout...' : 'Ajouter le médicament'}
              </Button>
            </div>
          </Form>
        </Card>

        <Card className="card-tw p-4">
          <h4 className="mb-3">Traitements en cours</h4>
          {medicaments.length > 0 ? (
            <Table borderless className="align-middle">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Dosage</th>
                  <th>Fréquence</th>
                  <th>Heure de prise</th>
                  <th>Date de début</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {medicaments.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nom}</td>
                    <td>{m.dosage || '-'}</td>
                    <td>{m.frequence || '-'}</td>
                    <td>{m.heurePrise ? m.heurePrise.substring(0, 5) : '-'}</td>
                    <td>{m.dateDebut ? new Date(m.dateDebut).toLocaleDateString('fr-FR') : '-'}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(m.id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="mb-0">Aucun médicament enregistré pour le moment.</p>
          )}
        </Card>
      </Container>
    </>
  );
};

export default Medicaments;
