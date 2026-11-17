import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/style.css';

interface Rappel {
  id: number;
  titre: string;
  description: string;
  dateRappel: string;
  heureRappel: string;
}

const Rappels: React.FC = () => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [dateRappel, setDateRappel] = useState('');
  const [heureRappel, setHeureRappel] = useState('');
  const [rappelsAVenir, setRappelsAVenir] = useState<Rappel[]>([]);
  const [rappelsPasses, setRappelsPasses] = useState<Rappel[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRappels();
  }, []);

  const fetchRappels = async () => {
    try {
      const response = await api.get('/rappel');
      setRappelsAVenir(response.data.aVenir || []);
      setRappelsPasses(response.data.passes || []);
    } catch (error) {
      console.error('Error fetching rappels:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/rappel', {
        titre,
        description,
        dateRappel,
        heureRappel: heureRappel || null
      });
      setSuccess('Rappel ajouté avec succès.');
      setTitre('');
      setDescription('');
      setDateRappel('');
      setHeureRappel('');
      fetchRappels();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce rappel ?')) {
      try {
        await api.delete(`/rappel/${id}`);
        fetchRappels();
      } catch (error) {
        console.error('Error deleting rappel:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4">Rappels</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Ajouter un rappel</h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label className="form-label">Titre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: Prendre l'Amlodipine"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label">Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRappel}
                  onChange={(e) => setDateRappel(e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Form.Label className="form-label">Heure</Form.Label>
                <Form.Control
                  type="time"
                  value={heureRappel}
                  onChange={(e) => setHeureRappel(e.target.value)}
                />
              </Col>
              <Col md={3}>
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
                {loading ? 'Ajout...' : 'Ajouter le rappel'}
              </Button>
            </div>
          </Form>
        </Card>

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Rappels à venir</h4>
          {rappelsAVenir.length > 0 ? (
            rappelsAVenir.map((r) => (
              <div key={r.id} className="rappel-item p-3 mb-2 d-flex justify-content-between align-items-center">
                <div>
                  <strong>{r.titre}</strong>
                  <br />
                  <span className="sous-titre">
                    {new Date(r.dateRappel).toLocaleDateString('fr-FR')}
                    {r.heureRappel && ` à ${r.heureRappel.substring(0, 5)}`}
                  </span>
                  {r.description && <p className="mb-0 mt-1">{r.description}</p>}
                </div>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(r.id)}>
                  Supprimer
                </Button>
              </div>
            ))
          ) : (
            <p className="mb-0">Aucun rappel à venir.</p>
          )}
        </Card>

        {rappelsPasses.length > 0 && (
          <Card className="card-tw p-4">
            <h4 className="mb-3">Rappels passés</h4>
            {rappelsPasses.map((r) => (
              <div key={r.id} className="rappel-item rappel-passe p-3 mb-2 d-flex justify-content-between align-items-center">
                <div>
                  <strong>{r.titre}</strong>
                  <br />
                  <span className="sous-titre">
                    {new Date(r.dateRappel).toLocaleDateString('fr-FR')}
                    {r.heureRappel && ` à ${r.heureRappel.substring(0, 5)}`}
                  </span>
                </div>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(r.id)}>
                  Supprimer
                </Button>
              </div>
            ))}
          </Card>
        )}
      </Container>
    </>
  );
};

export default Rappels;
