package com.lunatierra.backend.dto;

import java.util.List;

public class LunarPhaseResponse {

    private final String phase;
    private final String displayName;
    private final List<String> activities;

    public LunarPhaseResponse(String phase, String displayName, List<String> activities) {
        this.phase = phase;
        this.displayName = displayName;
        this.activities = activities;
    }

    public String getPhase() {
        return phase;
    }

    public String getDisplayName() {
        return displayName;
    }

    public List<String> getActivities() {
        return activities;
    }
}
