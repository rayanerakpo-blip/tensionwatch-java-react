import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/style.css';

interface Contact {
  id: number;
  nom: string;
  telephone: string;
  lienAvecPatient: string;
}

interface Patient {
  nom: string;
  prenom: string;
  medecin: string;
  antecedants: string;
}

const Urgences: React.FC = () => {
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [lienAvecPatient, setLienAvecPatient] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsRes, patientRes] = await Promise.all([
        api.get('/contact'),
        api.get('/patient')
      ]);
      setContacts(contactsRes.data);
      if (patientRes.data.id) {
        setPatient(patientRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/contact', {
        nom,
        telephone,
        lienAvecPatient
      });
      setSuccess('Contact d\'urgence ajouté avec succès.');
      setNom('');
      setTelephone('');
      setLienAvecPatient('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer ce contact ?')) {
      try {
        await api.delete(`/contact/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4">Contacts d'urgence</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Numéros d'urgence</h4>
          <Row className="g-3">
            <Col md={4}>
              <a href="tel:15" className="contact-urgence d-block text-center p-3">
                <span className="numero-urgence">15</span>
                <span className="label-urgence">SAMU</span>
              </a>
            </Col>
            <Col md={4}>
              <a href="tel:18" className="contact-urgence d-block text-center p-3">
                <span className="numero-urgence">18</span>
                <span className="label-urgence">Pompiers</span>
              </a>
            </Col>
            <Col md={4}>
              <a href="tel:112" className="contact-urgence d-block text-center p-3">
                <span className="numero-urgence">112</span>
                <span className="label-urgence">Numéro d'urgence européen</span>
              </a>
            </Col>
          </Row>
        </Card>

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Médecin traitant</h4>
          {patient?.medecin ? (
            <p className="mb-0">
              <strong>{patient.medecin}</strong> — médecin traitant de {patient.prenom} {patient.nom}.
            </p>
          ) : (
            <p className="mb-0">Aucun médecin traitant renseigné pour le moment.</p>
          )}
        </Card>

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Ajouter un contact personnalisé</h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label className="form-label">Nom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: Marie Dupont"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Label className="form-label">Téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="ex: 0612345678"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Label className="form-label">Lien avec le patient</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: Fille, Voisin..."
                  value={lienAvecPatient}
                  onChange={(e) => setLienAvecPatient(e.target.value)}
                />
              </Col>
            </Row>
            <div className="d-grid mt-3">
              <Button type="submit" className="btn-success" disabled={loading}>
                {loading ? 'Ajout...' : 'Ajouter le contact'}
              </Button>
            </div>
          </Form>
        </Card>

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Mes contacts personnalisés</h4>
          {contacts.length > 0 ? (
            <Row className="g-3">
              {contacts.map((c) => (
                <Col md={6} key={c.id}>
                  <div className="contact-perso p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{c.nom}</strong>
                      {c.lienAvecPatient && <span className="sous-titre"> — {c.lienAvecPatient}</span>}
                      <br />
                      <a href={`tel:${c.telephone}`} className="lien-telephone">
                        {c.telephone}
                      </a>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c.id)}>
                      Supprimer
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="mb-0">Aucun contact personnalisé ajouté pour le moment.</p>
          )}
        </Card>

        {patient?.antecedants && (
          <Card className="card-tw p-4 card-alerte">
            <h4 className="mb-3">Antécédents médicaux à signaler aux secours</h4>
            <p className="mb-0" style={{whiteSpace: 'pre-line'}}>{patient.antecedants}</p>
          </Card>
        )}
      </Container>
    </>
  );
};

export default Urgences;
