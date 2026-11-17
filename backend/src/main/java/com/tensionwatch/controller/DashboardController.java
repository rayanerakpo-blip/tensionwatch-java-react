package com.tensionwatch.controller;

import com.tensionwatch.model.Patient;
import com.tensionwatch.repository.PatientRepository;
import com.tensionwatch.repository.TensionRepository;
import com.tensionwatch.security.UserDetailsImpl;
import com.tensionwatch.service.TensionEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    PatientRepository patientRepository;
    
    @Autowired
    TensionRepository tensionRepository;
    
    @Autowired
    TensionEvaluationService tensionEvaluationService;
    
    @GetMapping
    public ResponseEntity<?> getDashboard(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Map<String, Object> response = new HashMap<>();
        response.put("user", Map.of(
            "id", userDetails.getId(),
            "nom", userDetails.getNom(),
            "prenom", userDetails.getPrenom(),
            "email", userDetails.getUsername()
        ));
        
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId()).orElse(null);
        response.put("patient", patient);
        
        if (patient != null) {
            tensionRepository.findFirstByPatientOrderByDateMesureDesc(patient).ifPresent(tension -> {
                response.put("derniereTension", tension);
                response.put("evaluation", tensionEvaluationService.evaluerTension(tension.getSystolique(), tension.getDiastolique()));
            });
            response.put("historiqueRecent", tensionRepository.findByPatientOrderByDateMesureDesc(patient).stream().limit(5).toList());
        }
        
        return ResponseEntity.ok(response);
    }
}
