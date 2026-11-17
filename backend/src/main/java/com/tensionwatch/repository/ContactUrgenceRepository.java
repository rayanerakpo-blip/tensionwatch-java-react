package com.tensionwatch.repository;

import com.tensionwatch.model.ContactUrgence;
import com.tensionwatch.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactUrgenceRepository extends JpaRepository<ContactUrgence, Long> {
    List<ContactUrgence> findByPatientOrderByIdAsc(Patient patient);
}
