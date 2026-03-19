package com.lunatierra.backend.dto;

import java.util.List;

public class CropDetailRecommendation {

    private final Long cropId;
    private final String actionToday;
    private final String fieldObservation;
    private final String reason;
    private final List<String> warnings;

    public CropDetailRecommendation(Long cropId, String actionToday, String fieldObservation, String reason, List<String> warnings) {
        this.cropId = cropId;
        this.actionToday = actionToday;
        this.fieldObservation = fieldObservation;
        this.reason = reason;
        this.warnings = warnings;
    }

    public Long getCropId() {
        return cropId;
    }

    public String getActionToday() {
        return actionToday;
    }

    public String getFieldObservation() {
        return fieldObservation;
    }

    public String getReason() {
        return reason;
    }

    public List<String> getWarnings() {
        return warnings;
    }
}
