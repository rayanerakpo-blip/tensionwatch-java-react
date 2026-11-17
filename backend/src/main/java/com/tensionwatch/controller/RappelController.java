package com.tensionwatch.controller;

import com.tensionwatch.dto.RappelRequest;
import com.tensionwatch.model.Patient;
import com.tensionwatch.model.Rappel;
import com.tensionwatch.repository.PatientRepository;
import com.tensionwatch.repository.RappelRepository;
import com.tensionwatch.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/rappel")
public class RappelController {
    @Autowired
    RappelRepository rappelRepository;
    
    @Autowired
    PatientRepository patientRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllRappels(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<Rappel> rappels = rappelRepository.findByPatientOrderByDateRappelAscHeureRappelAsc(patient);
        LocalDate today = LocalDate.now();
        
        Map<String, List<Rappel>> response = new HashMap<>();
        response.put("aVenir", rappels.stream().filter(r -> !r.getDateRappel().isBefore(today)).collect(Collectors.toList()));
        response.put("passes", rappels.stream().filter(r -> r.getDateRappel().isBefore(today)).collect(Collectors.toList()));
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<?> addRappel(@RequestBody RappelRequest rappelRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        if (rappelRequest.getTitre() == null || rappelRequest.getTitre().trim().isEmpty() ||
            rappelRequest.getDateRappel() == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Le titre et la date du rappel sont obligatoires");
            return ResponseEntity.badRequest().body(response);
        }
        
        Rappel rappel = new Rappel();
        rappel.setTitre(rappelRequest.getTitre());
        rappel.setDescription(rappelRequest.getDescription());
        rappel.setDateRappel(rappelRequest.getDateRappel());
        rappel.setHeureRappel(rappelRequest.getHeureRappel());
        rappel.setPatient(patient);
        
        rappelRepository.save(rappel);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Rappel ajouté avec succès");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRappel(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        Rappel rappel = rappelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rappel not found"));
        
        if (!rappel.getPatient().getId().equals(patient.getId())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized");
            return ResponseEntity.badRequest().body(response);
        }
        
        rappelRepository.delete(rappel);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Rappel supprimé avec succès");
        return ResponseEntity.ok(response);
    }
}
