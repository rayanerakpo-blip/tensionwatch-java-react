package com.tensionwatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tensions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer systolique;
    
    private Integer diastolique;
    
    @Column(name = "date_mesure")
    private LocalDateTime dateMesure;
    
    @Column(columnDefinition = "TEXT")
    private String commentaire;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
