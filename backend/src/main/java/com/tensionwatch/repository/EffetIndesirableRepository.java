package com.tensionwatch.repository;

import com.tensionwatch.model.EffetIndesirable;
import com.tensionwatch.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EffetIndesirableRepository extends JpaRepository<EffetIndesirable, Long> {
    List<EffetIndesirable> findByPatientOrderByDateEffetDesc(Patient patient);
}
