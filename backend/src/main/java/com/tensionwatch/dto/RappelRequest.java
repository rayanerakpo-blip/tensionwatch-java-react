package com.tensionwatch.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RappelRequest {
    private String titre;
    private String description;
    private LocalDate dateRappel;
    private LocalTime heureRappel;
}
