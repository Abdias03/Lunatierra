package com.lunatierra.backend.dto;

public class StageInsight {

    private final Long id;
    private final String key;
    private final String name;
    private final String description;
    private final long daysSincePlanting;
    private final int minDay;
    private final int maxDay;

    public StageInsight(Long id, String key, String name, String description, long daysSincePlanting, int minDay, int maxDay) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.description = description;
        this.daysSincePlanting = daysSincePlanting;
        this.minDay = minDay;
        this.maxDay = maxDay;
    }

    public Long getId() {
        return id;
    }

    public String getKey() {
        return key;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public long getDaysSincePlanting() {
        return daysSincePlanting;
    }

    public int getMinDay() {
        return minDay;
    }

    public int getMaxDay() {
        return maxDay;
    }
}
