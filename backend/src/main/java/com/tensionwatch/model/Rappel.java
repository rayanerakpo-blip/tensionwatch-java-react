package com.tensionwatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "rappels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rappel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 150)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "date_rappel", nullable = false)
    private LocalDate dateRappel;
    
    @Column(name = "heure_rappel")
    private LocalTime heureRappel;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
