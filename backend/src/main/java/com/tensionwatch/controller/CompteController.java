package com.tensionwatch.controller;

import com.tensionwatch.dto.PasswordChangeRequest;
import com.tensionwatch.model.Utilisateur;
import com.tensionwatch.repository.UtilisateurRepository;
import com.tensionwatch.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/compte")
public class CompteController {
    @Autowired
    UtilisateurRepository utilisateurRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @GetMapping
    public ResponseEntity<?> getCompte(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Utilisateur utilisateur = utilisateurRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(utilisateur);
    }
    
    @PutMapping("/infos")
    public ResponseEntity<?> updateInfos(@RequestBody Utilisateur utilisateurRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Utilisateur utilisateur = utilisateurRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if email is already used by another user
        if (utilisateurRepository.existsByEmail(utilisateurRequest.getEmail()) && 
            !utilisateurRequest.getEmail().equals(utilisateur.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cet email est déjà utilisé par un autre compte");
            return ResponseEntity.badRequest().body(response);
        }
        
        utilisateur.setNom(utilisateurRequest.getNom());
        utilisateur.setPrenom(utilisateurRequest.getPrenom());
        utilisateur.setEmail(utilisateurRequest.getEmail());
        
        utilisateurRepository.save(utilisateur);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Informations mises à jour avec succès");
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Utilisateur utilisateur = utilisateurRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!encoder.matches(request.getAncienMotDePasse(), utilisateur.getMotDePasse())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Le mot de passe actuel est incorrect");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (!request.getNouveauMotDePasse().equals(request.getConfirmationMotDePasse())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Les nouveaux mots de passe ne correspondent pas");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (request.getNouveauMotDePasse().length() < 6) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Le nouveau mot de passe doit contenir au moins 6 caractères");
            return ResponseEntity.badRequest().body(response);
        }
        
        utilisateur.setMotDePasse(encoder.encode(request.getNouveauMotDePasse()));
        utilisateurRepository.save(utilisateur);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Mot de passe modifié avec succès");
        return ResponseEntity.ok(response);
    }
}
