package com.tensionwatch.dto;

import lombok.Data;

@Data
public class ContactUrgenceRequest {
    private String nom;
    private String telephone;
    private String lienAvecPatient;
}
