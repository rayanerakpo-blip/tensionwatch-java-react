import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/style.css';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  dateDeNaissance: string;
  groupeSanguin: string;
  poids: number;
  medecin: string;
  antecedants: string;
}

interface Tension {
  id: number;
  systolique: number;
  diastolique: number;
  dateMesure: string;
  commentaire: string;
}

interface Evaluation {
  niveau: string;
  label: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [derniereTension, setDerniereTension] = useState<Tension | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [historiqueRecent, setHistoriqueRecent] = useState<Tension[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setPatient(response.data.patient);
      setDerniereTension(response.data.derniereTension || null);
      setEvaluation(response.data.evaluation || null);
      setHistoriqueRecent(response.data.historiqueRecent || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
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

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-4">Chargement...</Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-4">
        {!patient ? (
          <Card className="card-tw p-4 mb-4 text-center bienvenue-tw">
            <h2 className="mb-3">Bienvenue sur TensionWatch !</h2>
            <p className="mb-3">
              TensionWatch est une interface pensée pour vous accompagner dans le suivi quotidien
              d'un proche atteint de troubles cardiovasculaires. Vous pouvez y suivre l'évolution
              de sa tension artérielle, gérer ses traitements, signaler d'éventuels effets indésirables,
              retrouver des conseils d'accompagnement, et garder à portée de main ses contacts d'urgence.
            </p>
            <p className="mb-4 fw-bold">Pour commencer, veuillez ajouter un patient.</p>
            <Link to="/patient" className="btn btn-success" style={{width: 'fit-content', margin: '0 auto'}}>
              Ajouter un patient
            </Link>
          </Card>
        ) : (
          <>
            {evaluation && evaluation.niveau !== 'normale' && (
              <Alert className={`alerte-tension alerte-tension-${evaluation.niveau} mb-4 p-3 text-center`}>
                ⚠️ {evaluation.label}
              </Alert>
            )}

            <Card className="card-tw p-4 mb-4 d-flex flex-row justify-content-between align-items-start">
              <div>
                <h2 className="mb-1">{patient.prenom} {patient.nom}</h2>
                <p className="sous-titre mb-0">
                  Né(e) le {patient.dateDeNaissance ? new Date(patient.dateDeNaissance).toLocaleDateString('fr-FR') : 'Non renseigné'}
                  &nbsp;|&nbsp; Groupe sanguin : {patient.groupeSanguin || 'Non renseigné'}
                  &nbsp;|&nbsp; Poids : {patient.poids || 'Non renseigné'} kg
                </p>
              </div>
              <Link to="/patient" className="btn btn-sm" style={{borderColor:'#048b9a', color:'#048b9a'}}>
                Modifier
              </Link>
            </Card>

            <Card className="card-tw p-4 mb-4">
              <h4 className="mb-3">Dernière mesure de tension</h4>
              {derniereTension ? (
                <>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="valeur-tension">
                        {derniereTension.systolique}/{derniereTension.diastolique}
                      </span>
                      <span className="unite-tension">mmHg</span>
                      <br />
                      {evaluation && (
                        <span className={`badge-tension badge-tension-${evaluation.niveau} mt-2 d-inline-block`}>
                          {evaluation.label}
                        </span>
                      )}
                    </div>
                    <div className="text-end">
                      <p className="mb-0 sous-titre">
                        {new Date(derniereTension.dateMesure).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {derniereTension.commentaire && (
                    <p className="mt-2 mb-0">{derniereTension.commentaire}</p>
                  )}
                </>
              ) : (
                <p className="mb-0">Aucune mesure enregistrée pour le moment.</p>
              )}
            </Card>

            {historiqueRecent.length > 1 && (
              <Card className="card-tw p-4 mb-4">
                <h4 className="mb-3">Historique récent</h4>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Systolique</th>
                      <th>Diastolique</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historiqueRecent.map((t) => {
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </>
        )}

        <Row className="g-3">
          <Col xs={6} md={3}>
            <Link to="/tension" className="btn-menu w-100 d-block text-center p-3">Tension</Link>
          </Col>
          <Col xs={6} md={3}>
            <Link to="/medicaments" className="btn-menu w-100 d-block text-center p-3">Traitements</Link>
          </Col>
          <Col xs={6} md={3}>
            <Link to="/effets" className="btn-menu w-100 d-block text-center p-3">Effets indésirables</Link>
          </Col>
          <Col xs={6} md={3}>
            <Link to="/conseils" className="btn-menu w-100 d-block text-center p-3">Conseils</Link>
          </Col>
          <Col xs={6} md={6}>
            <Link to="/urgences" className="btn-menu-urgence w-100 d-block text-center p-3">Contacts d'urgence</Link>
          </Col>
          <Col xs={6} md={6}>
            <Link to="/export" className="btn-menu w-100 d-block text-center p-3">📄 Exporter le dossier</Link>
          </Col>
          <Col xs={12}>
            <Link to="/rappels" className="btn-menu w-100 d-block text-center p-3">🔔 Rappels</Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
