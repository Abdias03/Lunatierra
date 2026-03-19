package com.lunatierra.backend.dto;

public class StageInsight {

    private final Long id;
    private final String key;
    private final String name;
    private final String description;
    private final long daysSincePlanting;

    public StageInsight(Long id, String key, String name, String description, long daysSincePlanting) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.description = description;
        this.daysSincePlanting = daysSincePlanting;
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
}
