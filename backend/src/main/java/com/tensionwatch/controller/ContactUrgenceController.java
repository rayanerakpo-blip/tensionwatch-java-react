package com.tensionwatch.controller;

import com.tensionwatch.dto.ContactUrgenceRequest;
import com.tensionwatch.model.ContactUrgence;
import com.tensionwatch.model.Patient;
import com.tensionwatch.repository.ContactUrgenceRepository;
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
@RequestMapping("/api/contact")
public class ContactUrgenceController {
    @Autowired
    ContactUrgenceRepository contactUrgenceRepository;
    
    @Autowired
    PatientRepository patientRepository;
    
    @GetMapping
    public ResponseEntity<?> getAllContacts(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<ContactUrgence> contacts = contactUrgenceRepository.findByPatientOrderByIdAsc(patient);
        return ResponseEntity.ok(contacts);
    }
    
    @PostMapping
    public ResponseEntity<?> addContact(@RequestBody ContactUrgenceRequest contactRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        if (contactRequest.getNom() == null || contactRequest.getNom().trim().isEmpty() ||
            contactRequest.getTelephone() == null || contactRequest.getTelephone().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Le nom et le téléphone du contact sont obligatoires");
            return ResponseEntity.badRequest().body(response);
        }
        
        ContactUrgence contact = new ContactUrgence();
        contact.setNom(contactRequest.getNom());
        contact.setTelephone(contactRequest.getTelephone());
        contact.setLienAvecPatient(contactRequest.getLienAvecPatient());
        contact.setPatient(patient);
        
        contactUrgenceRepository.save(contact);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Contact d'urgence ajouté avec succès");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Patient patient = patientRepository.findByUtilisateurId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        ContactUrgence contact = contactUrgenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        if (!contact.getPatient().getId().equals(patient.getId())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized");
            return ResponseEntity.badRequest().body(response);
        }
        
        contactUrgenceRepository.delete(contact);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Contact supprimé avec succès");
        return ResponseEntity.ok(response);
    }
}
