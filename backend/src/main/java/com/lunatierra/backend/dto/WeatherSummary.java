package com.lunatierra.backend.dto;

public class WeatherSummary {

    private final String condition;
    private final int maxTemperature;
    private final int rainChance;
    private final int humidity;

    public WeatherSummary(String condition, int maxTemperature, int rainChance, int humidity) {
        this.condition = condition;
        this.maxTemperature = maxTemperature;
        this.rainChance = rainChance;
        this.humidity = humidity;
    }

    public String getCondition() {
        return condition;
    }

    public int getMaxTemperature() {
        return maxTemperature;
    }

    public int getRainChance() {
        return rainChance;
    }

    public int getHumidity() {
        return humidity;
    }
}
