package com.tensionwatch.repository;

import com.tensionwatch.model.Patient;
import com.tensionwatch.model.Tension;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TensionRepository extends JpaRepository<Tension, Long> {
    List<Tension> findByPatientOrderByDateMesureDesc(Patient patient);
    List<Tension> findByPatientOrderByDateMesureAsc(Patient patient);
    Optional<Tension> findFirstByPatientOrderByDateMesureDesc(Patient patient);
}
