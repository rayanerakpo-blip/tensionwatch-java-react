package com.tensionwatch.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PatientRequest {
    private String nom;
    private String prenom;
    private LocalDate dateDeNaissance;
    private String groupeSanguin;
    private BigDecimal poids;
    private String medecin;
    private String antecedants;
}
