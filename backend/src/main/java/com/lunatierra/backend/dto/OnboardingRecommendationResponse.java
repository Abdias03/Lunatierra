package com.lunatierra.backend.dto;

import java.util.List;

public class OnboardingRecommendationResponse {

    private final String lunarPhase;
    private final String message;
    private final List<String> recommendedCrops;
    private final String actionType;

    public OnboardingRecommendationResponse(
            String lunarPhase,
            String message,
            List<String> recommendedCrops,
            String actionType
    ) {
        this.lunarPhase = lunarPhase;
        this.message = message;
        this.recommendedCrops = recommendedCrops;
        this.actionType = actionType;
    }

    public String getLunarPhase() {
        return lunarPhase;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getRecommendedCrops() {
        return recommendedCrops;
    }

    public String getActionType() {
        return actionType;
    }
}
