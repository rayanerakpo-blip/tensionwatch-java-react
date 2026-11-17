package com.tensionwatch.controller;

import com.tensionwatch.dto.MedicamentRequest;
import com.tensionwatch.model.Medicament;
import com.tensionwatch.model.Patient;
import com.tensionwatch.repository.MedicamentRepository;
import com.tensionwatch.repository.PatientRepository;
import com.tensionwatch.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medicament")
public class MedicamentController {
    @Autowired
    MedicamentRepository medicamentRepository;
    
    @Autowired
    PatientRepository patientRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllMedicaments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<Medicament> medicaments = medicamentRepository.findByPatientOrderByDateDebutDesc(patient);
        return ResponseEntity.ok(medicaments);
    }
    
    @PostMapping
    public ResponseEntity<?> addMedicament(@RequestBody MedicamentRequest medicamentRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        if (medicamentRequest.getNom() == null || medicamentRequest.getNom().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Le nom du médicament est obligatoire");
            return ResponseEntity.badRequest().body(response);
        }
        
        Medicament medicament = new Medicament();
        medicament.setNom(medicamentRequest.getNom());
        medicament.setDosage(medicamentRequest.getDosage());
        medicament.setFrequence(medicamentRequest.getFrequence());
        medicament.setHeurePrise(medicamentRequest.getHeurePrise());
        medicament.setDateDebut(medicamentRequest.getDateDebut());
        medicament.setPatient(patient);
        
        medicamentRepository.save(medicament);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Médicament ajouté avec succès");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicament(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        Medicament medicament = medicamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicament not found"));
        
        if (!medicament.getPatient().getId().equals(patient.getId())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized");
            return ResponseEntity.badRequest().body(response);
        }
        
        medicamentRepository.delete(medicament);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Médicament supprimé avec succès");
        return ResponseEntity.ok(response);
    }
}
