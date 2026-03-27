package com.lunatierra.backend.dto;

public class AdminLunarActivityResponse {

    private final Long id;
    private final String phase;
    private final String activity;

    public AdminLunarActivityResponse(Long id, String phase, String activity) {
        this.id = id;
        this.phase = phase;
        this.activity = activity;
    }

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
