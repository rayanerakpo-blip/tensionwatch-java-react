package com.tensionwatch.controller;

import com.tensionwatch.dto.EffetIndesirableRequest;
import com.tensionwatch.model.EffetIndesirable;
import com.tensionwatch.model.Patient;
import com.tensionwatch.repository.EffetIndesirableRepository;
import com.tensionwatch.repository.PatientRepository;
import com.tensionwatch.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/effet")
public class EffetIndesirableController {
    @Autowired
    EffetIndesirableRepository effetIndesirableRepository;
    
    @Autowired
    PatientRepository patientRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllEffets(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<EffetIndesirable> effets = effetIndesirableRepository.findByPatientOrderByDateEffetDesc(patient);
        return ResponseEntity.ok(effets);
    }
    
    @PostMapping
    public ResponseEntity<?> addEffet(@RequestBody EffetIndesirableRequest effetRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        if (effetRequest.getTypeEffet() == null || effetRequest.getTypeEffet().trim().isEmpty() ||
            effetRequest.getIntensite() == null || effetRequest.getDateEffet() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Merci de renseigner au minimum le type d'effet, l'intensité et la date");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (effetRequest.getDateEffet().isAfter(LocalDate.now())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "La date de l'effet indésirable ne peut pas être dans le futur");
            return ResponseEntity.badRequest().body(response);
        }
        
        EffetIndesirable effet = new EffetIndesirable();
        effet.setTypeEffet(effetRequest.getTypeEffet());
        effet.setIntensite(effetRequest.getIntensite());
        effet.setFrequence(effetRequest.getFrequence());
        effet.setDescription(effetRequest.getDescription());
        effet.setDateEffet(effetRequest.getDateEffet());
        effet.setPatient(patient);
        
        effetIndesirableRepository.save(effet);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Effet indésirable signalé avec succès");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEffet(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        EffetIndesirable effet = effetIndesirableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Effet not found"));
        
        if (!effet.getPatient().getId().equals(patient.getId())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized");
            return ResponseEntity.badRequest().body(response);
        }
        
        effetIndesirableRepository.delete(effet);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Effet supprimé avec succès");
        return ResponseEntity.ok(response);
    }
}
