package com.lunatierra.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "regions")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(name = "climate_type")
    private String climateType;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getClimateType() {
        return climateType;
    }
}
