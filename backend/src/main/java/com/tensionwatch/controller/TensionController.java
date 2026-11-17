package com.tensionwatch.controller;

import com.tensionwatch.dto.TensionRequest;
import com.tensionwatch.model.Patient;
import com.tensionwatch.model.Tension;
import com.tensionwatch.repository.PatientRepository;
import com.tensionwatch.repository.TensionRepository;
import com.tensionwatch.security.UserDetailsImpl;
import com.tensionwatch.service.TensionEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tension")
public class TensionController {
    @Autowired
    TensionRepository tensionRepository;
    
    @Autowired
    PatientRepository patientRepository;
    
    @Autowired
    TensionEvaluationService tensionEvaluationService;
    
    @GetMapping
    public ResponseEntity<?> getAllTensions(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<Tension> tensions = tensionRepository.findByPatientOrderByDateMesureAsc(patient);
        return ResponseEntity.ok(tensions);
    }
    
    @GetMapping("/last")
    public ResponseEntity<?> getLastTension(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        return tensionRepository.findFirstByPatientOrderByDateMesureDesc(patient)
                .map(tension -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("tension", tension);
                    response.put("evaluation", tensionEvaluationService.evaluerTension(tension.getSystolique(), tension.getDiastolique()));
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.ok(new HashMap<>()));
    }
    
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentTensions(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<Tension> tensions = tensionRepository.findByPatientOrderByDateMesureDesc(patient);
        List<Tension> recent = tensions.stream().limit(5).toList();
        return ResponseEntity.ok(recent);
    }
    
    @PostMapping
    public ResponseEntity<?> addTension(@RequestBody TensionRequest tensionRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        // Validation
        if (tensionRequest.getSystolique() < 40 || tensionRequest.getSystolique() > 300 ||
            tensionRequest.getDiastolique() < 20 || tensionRequest.getDiastolique() > 200) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Les valeurs saisies sont hors des limites physiologiques possibles");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (tensionRequest.getDateMesure().isAfter(LocalDateTime.now())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "La date de la mesure ne peut pas être dans le futur");
            return ResponseEntity.badRequest().body(response);
        }
        
        Tension tension = new Tension();
        tension.setSystolique(tensionRequest.getSystolique());
        tension.setDiastolique(tensionRequest.getDiastolique());
        tension.setDateMesure(tensionRequest.getDateMesure());
        tension.setCommentaire(tensionRequest.getCommentaire());
        tension.setPatient(patient);
        
        tensionRepository.save(tension);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Mesure enregistrée avec succès");
        response.put("evaluation", tensionEvaluationService.evaluerTension(tension.getSystolique(), tension.getDiastolique()));
        return ResponseEntity.ok(response);
    }
}
