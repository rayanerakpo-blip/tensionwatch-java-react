package com.tensionwatch.dto;

import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String ancienMotDePasse;
    private String nouveauMotDePasse;
    private String confirmationMotDePasse;
}
