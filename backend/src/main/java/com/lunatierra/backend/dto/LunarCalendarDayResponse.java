package com.lunatierra.backend.dto;

import java.util.List;

public class LunarCalendarDayResponse {

    private final String date;
    private final String phase;
    private final String displayName;
    private final List<String> activities;
    private final List<String> crops;

    public LunarCalendarDayResponse(String date, String phase, String displayName, List<String> activities, List<String> crops) {
        this.date = date;
        this.phase = phase;
        this.displayName = displayName;
        this.activities = activities;
        this.crops = crops;
    }

    public String getDate() {
        return date;
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

    public List<String> getCrops() {
        return crops;
    }
}
