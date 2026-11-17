package com.tensionwatch.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TensionRequest {
    private Integer systolique;
    private Integer diastolique;
    private LocalDateTime dateMesure;
    private String commentaire;
}
