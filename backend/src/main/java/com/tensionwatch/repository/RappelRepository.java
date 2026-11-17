package com.tensionwatch.repository;

import com.tensionwatch.model.Patient;
import com.tensionwatch.model.Rappel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RappelRepository extends JpaRepository<Rappel, Long> {
    List<Rappel> findByPatientOrderByDateRappelAscHeureRappelAsc(Patient patient);
}
