package com.tensionwatch.security;

import com.tensionwatch.model.Utilisateur;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private String username;
    private String password;
    private String nom;
    private String prenom;
    
    public UserDetailsImpl(Long id, String username, String password, String nom, String prenom) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.nom = nom;
        this.prenom = prenom;
    }
    
    public static UserDetailsImpl build(Utilisateur utilisateur) {
        return new UserDetailsImpl(
                utilisateur.getId(),
                utilisateur.getEmail(),
                utilisateur.getMotDePasse(),
                utilisateur.getNom(),
                utilisateur.getPrenom()
        );
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
    
    public Long getId() {
        return id;
    }
    
    public String getNom() {
        return nom;
    }
    
    public String getPrenom() {
        return prenom;
    }
}
