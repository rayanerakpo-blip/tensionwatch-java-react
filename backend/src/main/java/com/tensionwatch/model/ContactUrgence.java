package com.tensionwatch.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contacts_urgence")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactUrgence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nom;
    
    @Column(nullable = false, length = 20)
    private String telephone;
    
    @Column(name = "lien_avec_patient", length = 100)
    private String lienAvecPatient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
