package com.lunatierra.backend.dto;

import java.util.List;

public class LunarPhaseResponse {

    private final String phase;
    private final String displayName;
    private final List<String> activities;
    private final List<String> recommendedCrops;

    public LunarPhaseResponse(String phase, String displayName, List<String> activities, List<String> recommendedCrops) {
        this.phase = phase;
        this.displayName = displayName;
        this.activities = activities;
        this.recommendedCrops = recommendedCrops;
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

    public List<String> getRecommendedCrops() {
        return recommendedCrops;
    }
}
