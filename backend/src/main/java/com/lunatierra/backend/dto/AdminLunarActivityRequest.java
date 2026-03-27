package com.lunatierra.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminLunarActivityRequest {

    @NotBlank
    private String phase;

    @NotBlank
    private String activity;

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }
}
