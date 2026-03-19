package com.lunatierra.backend.dto;

import java.util.List;

public class CropIntelligenceResponse {

    private final StageInsight stage;
    private final String actionToday;
    private final String observation;
    private final String reason;
    private final List<String> warnings;
    private final String lunarPhase;
    private final List<String> lunarActivities;
    private final WeatherSummary weather;

    public CropIntelligenceResponse(StageInsight stage, String actionToday, String observation, String reason, List<String> warnings,
                                    String lunarPhase, List<String> lunarActivities, WeatherSummary weather) {
        this.stage = stage;
        this.actionToday = actionToday;
        this.observation = observation;
        this.reason = reason;
        this.warnings = warnings;
        this.lunarPhase = lunarPhase;
        this.lunarActivities = lunarActivities;
        this.weather = weather;
    }

    public StageInsight getStage() {
        return stage;
    }

    public String getActionToday() {
        return actionToday;
    }

    public String getObservation() {
        return observation;
    }

    public String getReason() {
        return reason;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public String getLunarPhase() {
        return lunarPhase;
    }

    public List<String> getLunarActivities() {
        return lunarActivities;
    }

    public WeatherSummary getWeather() {
        return weather;
    }
}
