package com.tensionwatch.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EffetIndesirableRequest {
    private String typeEffet;
    private Integer intensite;
    private String frequence;
    private String description;
    private LocalDate dateEffet;
}
