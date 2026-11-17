package com.tensionwatch.repository;

import com.tensionwatch.model.Patient;
import com.tensionwatch.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUtilisateur(Utilisateur utilisateur);
    Optional<Patient> findByUtilisateurId(Long utilisateurId);
}
