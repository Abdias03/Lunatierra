package com.lunatierra.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "lunar_activities")
public class LunarActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phase;
    private String activity;

    public Long getId() {
        return id;
    }

    public String getPhase() {
        return phase;
    }

    public String getActivity() {
        return activity;
    }
}
