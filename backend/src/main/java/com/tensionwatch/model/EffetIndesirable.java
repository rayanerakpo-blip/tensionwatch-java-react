package com.tensionwatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "effets_indesirables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EffetIndesirable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "type_effet", length = 100)
    private String typeEffet;
    
    private Integer intensite;
    
    @Column(length = 100)
    private String frequence;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "date_effet")
    private LocalDate dateEffet;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
