import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Table } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/style.css';

interface Effet {
  id: number;
  typeEffet: string;
  intensite: number;
  frequence: string;
  description: string;
  dateEffet: string;
}

const Effets: React.FC = () => {
  const [typeEffet, setTypeEffet] = useState('');
  const [intensite, setIntensite] = useState('');
  const [frequence, setFrequence] = useState('');
  const [description, setDescription] = useState('');
  const [dateEffet, setDateEffet] = useState('');
  const [effets, setEffets] = useState<Effet[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEffets();
    setDateEffet(new Date().toISOString().split('T')[0]);
  }, []);

  const fetchEffets = async () => {
    try {
      const response = await api.get('/effet');
      setEffets(response.data);
    } catch (error) {
      console.error('Error fetching effets:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/effet', {
        typeEffet,
        intensite: parseInt(intensite),
        frequence,
        description,
        dateEffet
      });
      setSuccess('Effet indésirable signalé avec succès.');
      setTypeEffet('');
      setIntensite('');
      setFrequence('');
      setDescription('');
      fetchEffets();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du signalement.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce signalement ?')) {
      try {
        await api.delete(`/effet/${id}`);
        fetchEffets();
      } catch (error) {
        console.error('Error deleting effet:', error);
      }
    }
  };

  const getIntensiteBadge = (intensite: number) => {
    if (intensite >= 7) return 'haute';
    if (intensite >= 4) return 'moyenne';
    return 'basse';
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4">Effets indésirables</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Signaler un effet indésirable</h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label className="form-label">Type d'effet</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: Vertiges"
                  value={typeEffet}
                  onChange={(e) => setTypeEffet(e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Form.Label className="form-label">Intensité (1-10)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="10"
                  placeholder="ex: 5"
                  value={intensite}
                  onChange={(e) => setIntensite(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label">Fréquence</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: Occasionnelle"
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Label className="form-label">Date</Form.Label>
                <Form.Control
                  type="date"
                  max={today}
                  value={dateEffet}
                  onChange={(e) => setDateEffet(e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Form.Label className="form-label">Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Optionnel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
            </Row>
            <div className="d-grid mt-3">
              <Button type="submit" className="btn-success" disabled={loading}>
                {loading ? 'Signalement...' : "Signaler l'effet"}
              </Button>
            </div>
          </Form>
        </Card>

        <Card className="card-tw p-4">
          <h4 className="mb-3">Historique des signalements</h4>
          {effets.length > 0 ? (
            <Table borderless className="align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type d'effet</th>
                  <th>Intensité</th>
                  <th>Fréquence</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {effets.map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.dateEffet).toLocaleDateString('fr-FR')}</td>
                    <td>{e.typeEffet}</td>
                    <td>
                      <span className={`badge-intensite badge-intensite-${getIntensiteBadge(e.intensite)}`}>
                        {e.intensite}/10
                      </span>
                    </td>
                    <td>{e.frequence || '-'}</td>
                    <td>{e.description || '-'}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(e.id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="mb-0">Aucun effet indésirable signalé pour le moment.</p>
          )}
        </Card>
      </Container>
    </>
  );
};

export default Effets;
