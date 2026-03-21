package com.lunatierra.backend.dto;

import java.util.List;

public class AIContext {

    private final String crop;
    private final String stage;
    private final long day;
    private final String weatherCondition;
    private final boolean waterAvailable;
    private final String actionToday;
    private final String observation;
    private final List<String> warnings;

    public AIContext(String crop, String stage, long day, String weatherCondition, boolean waterAvailable,
                     String actionToday, String observation, List<String> warnings) {
        this.crop = crop;
        this.stage = stage;
        this.day = day;
        this.weatherCondition = weatherCondition;
        this.waterAvailable = waterAvailable;
        this.actionToday = actionToday;
        this.observation = observation;
        this.warnings = warnings;
    }

    public String getCrop() {
        return crop;
    }

    public String getStage() {
        return stage;
    }

    public long getDay() {
        return day;
    }

    public String getWeatherCondition() {
        return weatherCondition;
    }

    public boolean isWaterAvailable() {
        return waterAvailable;
    }

    public String getActionToday() {
        return actionToday;
    }

    public String getObservation() {
        return observation;
    }

    public List<String> getWarnings() {
        return warnings;
    }
}
