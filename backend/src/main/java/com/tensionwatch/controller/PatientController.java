package com.tensionwatch.controller;

import com.tensionwatch.dto.PatientRequest;
import com.tensionwatch.model.Patient;
import com.tensionwatch.model.Utilisateur;
import com.tensionwatch.repository.PatientRepository;
import com.tensionwatch.repository.UtilisateurRepository;
import com.tensionwatch.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/patient")
public class PatientController {
    @Autowired
    PatientRepository patientRepository;
    
    @Autowired
    UtilisateurRepository utilisateurRepository;
    
    @GetMapping
    public ResponseEntity<?> getPatient(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Patient> patientOpt = patientRepository.findByUtilisateurId(userDetails.getId());
        
        if (patientOpt.isPresent()) {
            return ResponseEntity.ok(patientOpt.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "No patient found");
            return ResponseEntity.ok(response);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createOrUpdatePatient(@RequestBody PatientRequest patientRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Utilisateur utilisateur = utilisateurRepository.findById(userDetails.getId()).orElseThrow();
        
        Optional<Patient> patientOpt = patientRepository.findByUtilisateur(utilisateur);
        Patient patient;
        
        if (patientOpt.isPresent()) {
            patient = patientOpt.get();
        } else {
            patient = new Patient();
            patient.setUtilisateur(utilisateur);
        }
        
        patient.setNom(patientRequest.getNom());
        patient.setPrenom(patientRequest.getPrenom());
        patient.setDateDeNaissance(patientRequest.getDateDeNaissance());
        patient.setGroupeSanguin(patientRequest.getGroupeSanguin());
        patient.setPoids(patientRequest.getPoids());
        patient.setMedecin(patientRequest.getMedecin());
        patient.setAntecedants(patientRequest.getAntecedants());
        
        patientRepository.save(patient);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", patientOpt.isPresent() ? "Patient updated successfully" : "Patient created successfully");
        return ResponseEntity.ok(response);
    }
}
