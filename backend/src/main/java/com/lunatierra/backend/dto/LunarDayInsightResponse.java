package com.lunatierra.backend.dto;

import java.util.List;

public class LunarDayInsightResponse {

    private final String phase;
    private final String message;
    private final List<String> actions;
    private final List<String> avoid;
    private final List<String> recommendedCrops;

    public LunarDayInsightResponse(
            String phase,
            String message,
            List<String> actions,
            List<String> avoid,
            List<String> recommendedCrops
    ) {
        this.phase = phase;
        this.message = message;
        this.actions = actions;
        this.avoid = avoid;
        this.recommendedCrops = recommendedCrops;
    }

    public String getPhase() {
        return phase;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getActions() {
        return actions;
    }

    public List<String> getAvoid() {
        return avoid;
    }

    public List<String> getRecommendedCrops() {
        return recommendedCrops;
    }
}
