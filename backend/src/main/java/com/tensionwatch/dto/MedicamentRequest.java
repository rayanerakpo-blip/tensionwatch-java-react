package com.tensionwatch.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MedicamentRequest {
    private String nom;
    private String dosage;
    private String frequence;
    private LocalTime heurePrise;
    private LocalDate dateDebut;
}
