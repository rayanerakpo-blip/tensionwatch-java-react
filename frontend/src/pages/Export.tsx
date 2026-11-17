import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import '../styles/style.css';

interface Patient {
  nom: string;
  prenom: string;
  dateDeNaissance: string;
  groupeSanguin: string;
  poids: number;
  medecin: string;
  antecedants: string;
}

interface Tension {
  systolique: number;
  diastolique: number;
  dateMesure: string;
  commentaire: string;
}

interface Medicament {
  nom: string;
  dosage: string;
  frequence: string;
  heurePrise: string;
  dateDebut: string;
}

interface Effet {
  typeEffet: string;
  intensite: number;
  frequence: string;
  description: string;
  dateEffet: string;
}

const Export: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [tensions, setTensions] = useState<Tension[]>([]);
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [effets, setEffets] = useState<Effet[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientRes, tensionsRes, medicamentsRes, effetsRes] = await Promise.all([
        api.get('/patient'),
        api.get('/tension'),
        api.get('/medicament'),
        api.get('/effet')
      ]);
      setPatient(patientRes.data);
      setTensions(tensionsRes.data);
      setMedicaments(medicamentsRes.data);
      setEffets(effetsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const evaluerTensionLocal = (systolique: number, diastolique: number) => {
    if (systolique >= 180 || diastolique >= 120) {
      return 'Crise hypertensive - Consultez en urgence';
    } else if (systolique >= 140 || diastolique >= 90) {
      return 'Hypertension';
    } else if (systolique >= 120 || diastolique >= 80) {
      return 'Tension élevée';
    } else {
      return 'Tension normale';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <div className="d-flex justify-content-between mb-4">
          <h2>Export du dossier patient</h2>
          <div>
            <Link to="/dashboard" className="btn btn-outline-primary me-2" style={{borderColor:'#048b9a', color:'#048b9a'}}>
              ← Retour au tableau de bord
            </Link>
            <Button className="btn-success" onClick={handlePrint}>
              🖨️ Imprimer / Enregistrer en PDF
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="mb-4 pb-3" style={{borderBottom: '3px solid #048b9a'}}>
            <h1 style={{color: '#048b9a', fontSize: '24px'}}>TensionWatch — Dossier patient</h1>
            <p style={{color: '#888888', fontSize: '12px'}}>Document généré le {new Date().toLocaleString('fr-FR')}</p>
          </div>

          {patient && (
            <div className="mb-4">
              <h2 style={{color: '#048b9a', fontSize: '16px', borderBottom: '1px solid #dddddd', paddingBottom: '6px'}}>
                Informations patient
              </h2>
              <div style={{fontSize: '13px', lineHeight: '1.8'}}>
                <strong>{patient.prenom} {patient.nom}</strong><br />
                Né(e) le {patient.dateDeNaissance ? new Date(patient.dateDeNaissance).toLocaleDateString('fr-FR') : 'Non renseigné'}<br />
                Groupe sanguin : {patient.groupeSanguin || 'Non renseigné'}<br />
                Poids : {patient.poids || 'Non renseigné'} kg<br />
                Médecin traitant : {patient.medecin || 'Non renseigné'}<br />
                {patient.antecedants && (
                  <>
                    Antécédents : <br />
                    <span style={{whiteSpace: 'pre-line'}}>{patient.antecedants}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h2 style={{color: '#048b9a', fontSize: '16px', borderBottom: '1px solid #dddddd', paddingBottom: '6px'}}>
              Historique des mesures de tension
            </h2>
            {tensions.length > 0 ? (
              <Table size="sm" bordered>
                <thead style={{backgroundColor: '#048b9a', color: '#ffffff'}}>
                  <tr>
                    <th>Date</th>
                    <th>Systolique</th>
                    <th>Diastolique</th>
                    <th>Statut</th>
                    <th>Commentaire</th>
                  </tr>
                </thead>
                <tbody>
                  {tensions.map((t, idx) => (
                    <tr key={idx}>
                      <td>{new Date(t.dateMesure).toLocaleString('fr-FR')}</td>
                      <td>{t.systolique}</td>
                      <td>{t.diastolique}</td>
                      <td>{evaluerTensionLocal(t.systolique, t.diastolique)}</td>
                      <td>{t.commentaire}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Aucune mesure enregistrée.</p>
            )}
          </div>

          <div className="mb-4">
            <h2 style={{color: '#048b9a', fontSize: '16px', borderBottom: '1px solid #dddddd', paddingBottom: '6px'}}>
              Traitements
            </h2>
            {medicaments.length > 0 ? (
              <Table size="sm" bordered>
                <thead style={{backgroundColor: '#048b9a', color: '#ffffff'}}>
                  <tr>
                    <th>Nom</th>
                    <th>Dosage</th>
                    <th>Fréquence</th>
                    <th>Heure de prise</th>
                    <th>Date de début</th>
                  </tr>
                </thead>
                <tbody>
                  {medicaments.map((m, idx) => (
                    <tr key={idx}>
                      <td>{m.nom}</td>
                      <td>{m.dosage || '-'}</td>
                      <td>{m.frequence || '-'}</td>
                      <td>{m.heurePrise ? m.heurePrise.substring(0, 5) : '-'}</td>
                      <td>{m.dateDebut ? new Date(m.dateDebut).toLocaleDateString('fr-FR') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Aucun traitement enregistré.</p>
            )}
          </div>

          <div className="mb-4">
            <h2 style={{color: '#048b9a', fontSize: '16px', borderBottom: '1px solid #dddddd', paddingBottom: '6px'}}>
              Effets indésirables signalés
            </h2>
            {effets.length > 0 ? (
              <Table size="sm" bordered>
                <thead style={{backgroundColor: '#048b9a', color: '#ffffff'}}>
                  <tr>
                    <th>Date</th>
                    <th>Type d'effet</th>
                    <th>Intensité</th>
                    <th>Fréquence</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {effets.map((e, idx) => (
                    <tr key={idx}>
                      <td>{new Date(e.dateEffet).toLocaleDateString('fr-FR')}</td>
                      <td>{e.typeEffet}</td>
                      <td>{e.intensite}/10</td>
                      <td>{e.frequence || '-'}</td>
                      <td>{e.description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Aucun effet indésirable signalé.</p>
            )}
          </div>

          <div className="text-center mt-4" style={{fontSize: '11px', color: '#999999'}}>
            Document généré automatiquement par TensionWatch — à destination du personnel médical.
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Export;
