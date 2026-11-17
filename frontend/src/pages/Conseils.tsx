import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import '../styles/style.css';

const Conseils: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4">Conseils d'accompagnement</h2>

        <Card className="card-tw p-4 mb-3">
          <h4 className="titre-conseil mb-3">🍎 Alimentation</h4>
          <ul className="liste-conseil">
            <li>Privilégier une alimentation pauvre en sel (moins de 5g/jour)</li>
            <li>Favoriser les fruits, légumes, céréales complètes</li>
            <li>Limiter les aliments transformés et riches en graisses saturées</li>
            <li>Privilégier le poisson, les légumineuses et les produits laitiers allégés</li>
            <li>Boire modérément et éviter l'excès d'alcool</li>
          </ul>
        </Card>

        <Card className="card-tw p-4 mb-3">
          <h4 className="titre-conseil mb-3">🏃 Activité physique</h4>
          <ul className="liste-conseil">
            <li>Pratiquer au moins 30 minutes d'activité modérée par jour</li>
            <li>Marcher, faire du vélo ou de la natation sont recommandés</li>
            <li>Éviter les efforts physiques intenses et brusques</li>
            <li>Adapter l'activité à l'âge et à l'état de santé</li>
          </ul>
        </Card>

        <Card className="card-tw p-4 mb-3">
          <h4 className="titre-conseil mb-3">😌 Gestion du stress</h4>
          <ul className="liste-conseil">
            <li>Prendre des moments de relaxation (respiration, méditation)</li>
            <li>Veiller à un sommeil suffisant (7-8 heures par nuit)</li>
            <li>Éviter les situations stressantes autant que possible</li>
            <li>Maintenir des liens sociaux et des activités plaisir</li>
          </ul>
        </Card>

        <Card className="card-tw p-4 mb-3">
          <h4 className="titre-conseil mb-3">💊 Suivi du traitement</h4>
          <ul className="liste-conseil">
            <li>Respecter scrupuleusement les prescriptions médicales</li>
            <li>Prendre les médicaments aux horaires prévus</li>
            <li>Ne jamais arrêter un traitement sans avis médical</li>
            <li>Signaler tout effet indésirable au médecin</li>
            <li>Conserver les médicaments dans un endroit approprié</li>
          </ul>
        </Card>

        <Card className="card-tw p-4 card-alerte">
          <h4 className="titre-conseil mb-3" style={{color: '#dc3545'}}>🚨 Signes d'urgence</h4>
          <ul className="liste-conseil">
            <li><strong>Douleur thoracique</strong> intense ou oppressante</li>
            <li><strong>Essoufflement</strong> brutal, difficulté à respirer</li>
            <li><strong>Perte de connaissance</strong> ou malaise important</li>
            <li><strong>Paralysie</strong> soudaine d'un membre ou difficulté à parler</li>
            <li><strong>Céphalée</strong> intense et brutale, troubles visuels</li>
            <li><strong>Tension très élevée</strong> (≥180/120 mmHg) avec symptômes</li>
          </ul>
          <p className="mt-3 mb-0 fw-bold" style={{color: '#dc3545'}}>
            En cas de signes d'urgence, appelez immédiatement le 15 (SAMU) ou le 112
          </p>
        </Card>
      </Container>
    </>
  );
};

export default Conseils;
