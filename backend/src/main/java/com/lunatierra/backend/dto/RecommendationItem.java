package com.lunatierra.backend.dto;

public class RecommendationItem {

    private final String title;
    private final String message;
    private final String severity;

    public RecommendationItem(String title, String message, String severity) {
        this.title = title;
        this.message = message;
        this.severity = severity;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getSeverity() {
        return severity;
    }
}
