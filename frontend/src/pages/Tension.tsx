import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Table } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/style.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Tension {
  id: number;
  systolique: number;
  diastolique: number;
  dateMesure: string;
  commentaire: string;
}

const TensionPage: React.FC = () => {
  const [systolique, setSystolique] = useState('');
  const [diastolique, setDiastolique] = useState('');
  const [dateMesure, setDateMesure] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [tensions, setTensions] = useState<Tension[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTensions();
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDateMesure(now.toISOString().slice(0, 16));
  }, []);

  const fetchTensions = async () => {
    try {
      const response = await api.get('/tension');
      setTensions(response.data);
    } catch (error) {
      console.error('Error fetching tensions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/tension', {
        systolique: parseInt(systolique),
        diastolique: parseInt(diastolique),
        dateMesure: dateMesure,
        commentaire
      });
      setSuccess('Mesure enregistrée avec succès.');
      setSystolique('');
      setDiastolique('');
      setCommentaire('');
      fetchTensions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  const evaluerTensionLocal = (systolique: number, diastolique: number) => {
    if (systolique >= 180 || diastolique >= 120) {
      return { niveau: 'urgence', label: 'Crise hypertensive - Consultez en urgence' };
    } else if (systolique >= 140 || diastolique >= 90) {
      return { niveau: 'haute', label: 'Hypertension' };
    } else if (systolique >= 120 || diastolique >= 80) {
      return { niveau: 'elevee', label: 'Tension élevée' };
    } else {
      return { niveau: 'normale', label: 'Tension normale' };
    }
  };

  const chartData = {
    labels: tensions.map(t => new Date(t.dateMesure).toLocaleString('fr-FR')),
    datasets: [
      {
        label: 'Systolique',
        data: tensions.map(t => t.systolique),
        borderColor: '#048b9a',
        backgroundColor: 'rgba(4, 139, 154, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Diastolique',
        data: tensions.map(t => t.diastolique),
        borderColor: '#34c759',
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const maxDate = now.toISOString().slice(0, 16);

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4">Suivi de la tension artérielle</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Ajouter une mesure</h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label className="form-label">Systolique</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="ex: 130"
                  min="40"
                  max="300"
                  value={systolique}
                  onChange={(e) => setSystolique(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label">Diastolique</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="ex: 85"
                  min="20"
                  max="200"
                  value={diastolique}
                  onChange={(e) => setDiastolique(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label">Date et heure</Form.Label>
                <Form.Control
                  type="datetime-local"
                  max={maxDate}
                  value={dateMesure}
                  onChange={(e) => setDateMesure(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label">Commentaire</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Optionnel"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                />
              </Col>
            </Row>
            <div className="d-grid mt-3">
              <Button type="submit" className="btn-success" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer la mesure'}
              </Button>
            </div>
          </Form>
        </Card>

        <Card className="card-tw p-4 mb-4">
          <h4 className="mb-3">Évolution</h4>
          {tensions.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p className="mb-0">Aucune donnée à afficher pour le moment.</p>
          )}
        </Card>

        <Card className="card-tw p-4">
          <h4 className="mb-3">Historique complet</h4>
          {tensions.length > 0 ? (
            <Table borderless>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Systolique</th>
                  <th>Diastolique</th>
                  <th>Statut</th>
                  <th>Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {[...tensions].reverse().map((t) => {
                  const evalLigne = evaluerTensionLocal(t.systolique, t.diastolique);
                  return (
                    <tr key={t.id}>
                      <td>{new Date(t.dateMesure).toLocaleString('fr-FR')}</td>
                      <td>{t.systolique}</td>
                      <td>{t.diastolique}</td>
                      <td>
                        <span className={`badge-tension badge-tension-${evalLigne.niveau}`}>
                          {evalLigne.label}
                        </span>
                      </td>
                      <td>{t.commentaire}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p className="mb-0">Aucune mesure enregistrée pour le moment.</p>
          )}
        </Card>
      </Container>
    </>
  );
};

export default TensionPage;
