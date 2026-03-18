package com.lunatierra.backend.dto;

public class GrowthStageDefinition {

    private final String nameKey;
    private final String expectedBehaviorKey;
    private final int minDay;
    private final int maxDay;

    public GrowthStageDefinition(String nameKey, String expectedBehaviorKey, int minDay, int maxDay) {
        this.nameKey = nameKey;
        this.expectedBehaviorKey = expectedBehaviorKey;
        this.minDay = minDay;
        this.maxDay = maxDay;
    }

    public String getNameKey() {
        return nameKey;
    }

    public String getExpectedBehaviorKey() {
        return expectedBehaviorKey;
    }

    public int getMinDay() {
        return minDay;
    }

    public int getMaxDay() {
        return maxDay;
    }
}
